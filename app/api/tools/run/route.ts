import { NextRequest, NextResponse } from 'next/server';
import { tools } from '@/data/tools';

const MAX_TOKENS = 2000;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  let body: { toolId?: string; inputs?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { toolId, inputs } = body;

  if (!toolId || typeof toolId !== 'string') {
    return NextResponse.json({ error: 'toolId is required' }, { status: 400 });
  }

  const tool = tools.find((t) => t.id === toolId);
  if (!tool?.systemPrompt || !tool.inputs) {
    return NextResponse.json({ error: 'Tool not found or not a live tool' }, { status: 404 });
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

  // Build user message from inputs
  const userMessage = tool.inputs
    .filter((inputDef) => inputs?.[inputDef.id]?.trim())
    .map((inputDef) => `**${inputDef.label}:**\n${inputs![inputDef.id].trim()}`)
    .join('\n\n');

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
        system: tool.systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${anthropicRes.status}` },
        { status: anthropicRes.status }
      );
    }

    // Stream the response directly through
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
