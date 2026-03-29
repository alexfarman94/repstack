import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

// GET: any authenticated user can read a platform agent
// Admins see system_prompt + inactive agents; reps see active only
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const isAdmin = role === 'admin';

  const supabase = createServerClient();
  let query = supabase
    .from('agents')
    .select(isAdmin ? '*' : 'id, name, description, inputs, is_active, created_at')
    .eq('id', params.id);

  if (!isAdmin) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

// PATCH: admin-only
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, system_prompt, inputs, is_active } = body;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('agents')
    .update({ name, description, system_prompt, inputs, is_active })
    .eq('id', params.id)
    .select('id, name, description, inputs, is_active, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE: admin-only
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
