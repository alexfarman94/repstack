import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;
const MAX_CONTEXT_CHARS = 160000; // ~120K tokens
const MAX_RETRIES = 2;
const RETRY_DELAYS = [1000, 3000]; // ms

interface RunRequestBody {
  agentId?: string;
  userAgentId?: string;
  accountId?: string;
  opportunityId?: string;
  extraInputs?: Record<string, string>;
}

async function fetchWithRetry(url: string, init: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, init);
    if (res.status === 529 && attempt < retries) {
      await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
      continue;
    }
    return res;
  }
  // Unreachable, but TS needs it
  throw new Error('Max retries exceeded');
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

  let body: RunRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { agentId, userAgentId, accountId, opportunityId, extraInputs = {} } = body;

  if (!agentId && !userAgentId) {
    return NextResponse.json({ error: 'agentId or userAgentId is required' }, { status: 400 });
  }

  const supabase = createServerClient();

  // ── 1. Fetch agent ──────────────────────────────────────────────────────────
  let agentName = '';
  let systemPrompt = '';
  let agentInputs: { id: string; label: string }[] = [];

  if (agentId) {
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('is_active', true)
      .single();

    if (error || !agent) {
      return NextResponse.json({ error: 'Agent not found or inactive' }, { status: 404 });
    }
    agentName = agent.name;
    systemPrompt = agent.system_prompt;
    agentInputs = Array.isArray(agent.inputs) ? (agent.inputs as { id: string; label: string }[]) : [];
  } else if (userAgentId) {
    const { data: agent, error } = await supabase
      .from('user_agents')
      .select('*')
      .eq('id', userAgentId)
      .eq('user_id', userId)
      .single();

    if (error || !agent) {
      return NextResponse.json({ error: 'Custom agent not found' }, { status: 404 });
    }
    agentName = agent.name;
    systemPrompt = agent.system_prompt;
    agentInputs = Array.isArray(agent.inputs) ? (agent.inputs as { id: string; label: string }[]) : [];
  }

  // ── 2. Fetch documents for context ──────────────────────────────────────────
  let docs: { title: string; content: string; doc_type: string }[] = [];

  if (opportunityId) {
    // Opp-scoped: get docs for this opp + account-level docs
    const { data } = await supabase
      .from('documents')
      .select('title, content, doc_type')
      .eq('user_id', userId)
      .or(`opportunity_id.eq.${opportunityId},and(account_id.eq.${accountId},opportunity_id.is.null)`)
      .order('created_at', { ascending: false });
    docs = data || [];
  } else if (accountId) {
    const { data } = await supabase
      .from('documents')
      .select('title, content, doc_type')
      .eq('user_id', userId)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });
    docs = data || [];
  }

  // ── 3. Build context string ─────────────────────────────────────────────────
  let contextBlock = '';
  if (docs.length > 0) {
    const docStrings = docs.map(
      (d) => `[${d.doc_type.toUpperCase()} — ${d.title}]\n${d.content}`
    );

    // Join and trim to fit context window — drop oldest docs first (they're at the end)
    let joined = '';
    for (const s of docStrings) {
      if ((joined + s).length > MAX_CONTEXT_CHARS) break;
      joined += s + '\n---\n';
    }

    contextBlock = `\n\n# Deal Context\nThe following documents are from the rep's account. Use this information to ground your response — do not ask for information already present here.\n\n${joined}`;
  }

  const fullSystemPrompt = systemPrompt + contextBlock;

  // ── 4. Build user message from extra inputs ─────────────────────────────────
  const userMessage =
    agentInputs
      .filter((inp) => extraInputs[inp.id]?.trim())
      .map((inp) => `**${inp.label}:**\n${extraInputs[inp.id].trim()}`)
      .join('\n\n') ||
    'Run this agent with the deal context provided.';

  // ── 5. Create run record (pre-stream, so we have the ID) ───────────────────
  const { data: runRecord, error: runErr } = await supabase
    .from('agent_runs')
    .insert({
      user_id: userId,
      agent_id: agentId || null,
      user_agent_id: userAgentId || null,
      account_id: accountId || null,
      opportunity_id: opportunityId || null,
      input_context: fullSystemPrompt.slice(0, 10000), // truncate for storage
    })
    .select('id')
    .single();

  if (runErr || !runRecord) {
    console.error('[run] Failed to create agent_runs record:', runErr?.message);
    return NextResponse.json({ error: 'Failed to log run' }, { status: 500 });
  }

  const runId = runRecord.id;

  // ── 6. Call Claude API with streaming ───────────────────────────────────────
  console.log(`[run] agent="${agentName}" model="${MODEL}" runId="${runId}" docs=${docs.length}`);

  let anthropicRes: Response;
  try {
    anthropicRes = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        stream: true,
        system: fullSystemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach Anthropic API' }, { status: 500 });
  }

  if (!anthropicRes.ok) {
    const errBody = await anthropicRes.text();
    console.error(`[run] Anthropic error ${anthropicRes.status}: ${errBody.slice(0, 300)}`);
    return NextResponse.json(
      { error: `Anthropic API error: ${anthropicRes.status}` },
      { status: anthropicRes.status }
    );
  }

  // ── 7. Stream response + collect output for logging ─────────────────────────
  const encoder = new TextEncoder();
  let fullOutput = '';
  let tokensUsed = 0;

  const stream = new ReadableStream({
    async start(controller) {
      // Send runId as the first SSE event so the client can use it for feedback
      controller.enqueue(encoder.encode(`event: run_id\ndata: ${runId}\n\n`));

      const reader = anthropicRes.body!.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // Pass through SSE events to client
          controller.enqueue(value);

          // Parse SSE lines to collect output text and token usage
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') continue;
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === 'content_block_delta' && event.delta?.text) {
                fullOutput += event.delta.text;
              }
              if (event.type === 'message_delta' && event.usage?.output_tokens) {
                tokensUsed = event.usage.output_tokens;
              }
            } catch {
              // Not JSON or partial line — skip
            }
          }
        }
      } catch (err) {
        console.error('[run] Stream read error:', err);
      } finally {
        // Update the run record with output and tokens
        await supabase
          .from('agent_runs')
          .update({
            output: fullOutput,
            tokens_used: tokensUsed || null,
          })
          .eq('id', runId);

        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      'X-Run-Id': runId,
    },
  });
}
