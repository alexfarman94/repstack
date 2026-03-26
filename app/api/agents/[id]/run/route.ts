import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import { ToolInput } from '@/lib/types';

interface AgentRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  system_prompt: string;
  inputs: ToolInput[];
  created_at: string;
}

const MAX_TOKENS = 2000;
const MAX_KB_CHARS = 50000;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

  let body: { inputs?: Record<string, string>; accountId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { inputs = {}, accountId } = body;

  const supabase = createServerClient();

  // Fetch agent — includes system_prompt server-side only
  const { data: agentData, error: agentError } = await supabase
    .from('agents')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single();

  if (agentError || !agentData) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  const agent = agentData as unknown as AgentRow;

  // Build KB context if accountId provided
  let kbContext = '';
  if (accountId) {
    const { data: docs } = await supabase
      .from('documents')
      .select('title, content, doc_type')
      .eq('user_id', userId)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (docs?.length) {
      const joined = docs
        .map((d) => `## ${d.title} (${d.doc_type})\n${d.content}`)
        .join('\n\n');
      kbContext = `\n\n---\n\n# Knowledge Base Context\nUse the following stored account information to personalise your response. Do not ask for information already present here.\n\n${joined.slice(0, MAX_KB_CHARS)}`;
    }
  }

  const systemPrompt = agent.system_prompt + kbContext;

  // Build user message from inputs
  const agentInputs = agent.inputs || [];
  const userMessage = agentInputs
    .filter((inp) => inputs[inp.id]?.trim())
    .map((inp) => `**${inp.label}:**\n${inputs[inp.id].trim()}`)
    .join('\n\n') || 'Please run this agent with the knowledge base context provided.';

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: MAX_TOKENS,
        stream: true,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      return NextResponse.json({ error: `Anthropic error: ${anthropicRes.status}` }, { status: anthropicRes.status });
    }

    return new Response(anthropicRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach Anthropic API' }, { status: 500 });
  }
}
