import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('user_agents')
    .select('id, user_id, name, description, inputs, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, description, system_prompt, inputs } = body;

  if (!name?.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  if (!system_prompt?.trim())
    return NextResponse.json({ error: 'system_prompt is required' }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('user_agents')
    .insert({
      user_id: userId,
      name: name.trim(),
      description: description?.trim() || null,
      system_prompt: system_prompt.trim(),
      inputs: inputs || [],
    })
    .select('id, user_id, name, description, inputs, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
