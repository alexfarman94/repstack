import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import { tools } from '@/data/tools';

const MAX_TOKENS = 2000;
const MAX_KB_CHARS = 50000;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  let body: { toolId?: string; inputs?: Record<string, string>; accountId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { toolId, inputs, accountId } = body;

  if (!toolId || typeof toolId !== 'string') {
    return NextResponse.json({ error: 'toolId is required' }, { status: 400 });
  }

  const tool = tools.find((t) => t.id === toolId);
  if (!tool) {
    console.error(`[tools/run] Tool not found. toolId="${toolId}" available=[${tools.map(t => t.id).join(',')}]`);
    return NextResponse.json({ error: `Tool not found: ${toolId}` }, { status: 404 });
  }
  if (!tool.systemPrompt) {
    console.error(`[tools/run] Tool "${toolId}" has no systemPrompt`);
    return NextResponse.json({ error: 'Tool has no system prompt' }, { status: 404 });
  }
  if (!tool.inputs) {
    console.error(`[tools/run] Tool "${toolId}" has no inputs`);
    return NextResponse.json({ error: 'Tool has no inputs defined' }, { status: 404 });
  }

  // Validate required inputs
  for (const inputDef of tool.inputs) {
    if (inputDef.required && (!inputs?.[inputDef.id] || !inputs[inputDef.id].trim())) {
      return NextResponse.json(
        { error: `Missing required field: ${inputDef.label}` },
        { status: 400 }
      );
    }
  }

  // Optionally inject KB context if user is authenticated and accountId is provided
  let kbContext = '';
  if (accountId) {
    const { userId } = await auth();
    if (userId) {
      const supabase = createServerClient();
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
  }

  const systemPrompt = tool.systemPrompt + kbContext;

  // Build user message from inputs
  const userMessage = tool.inputs
    .filter((inputDef) => inputs?.[inputDef.id]?.trim())
    .map((inputDef) => `**${inputDef.label}:**\n${inputs![inputDef.id].trim()}`)
    .join('\n\n');

  console.log(`[tools/run] Calling Anthropic for tool="${toolId}" model="claude-3-7-sonnet-20250219"`);

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: MAX_TOKENS,
        stream: true,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text();
      console.error(`[tools/run] Anthropic error ${anthropicRes.status}: ${errBody}`);
      return NextResponse.json(
        { error: `Anthropic API error: ${anthropicRes.status} — ${errBody.slice(0, 200)}` },
        { status: anthropicRes.status }
      );
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
