import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

// GET: returns all active platform agents (any authenticated user)
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('agents')
    .select('id, name, description, inputs, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: admin-only — create a platform agent
export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check admin role from Clerk publicMetadata
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, system_prompt, inputs } = body;

  if (!name?.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  if (!system_prompt?.trim())
    return NextResponse.json({ error: 'system_prompt is required' }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('agents')
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      system_prompt: system_prompt.trim(),
      inputs: inputs || [],
      is_active: true,
      created_by: userId,
    })
    .select('id, name, description, inputs, is_active, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
