import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest, { params }: { params: { runId: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { feedback: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { feedback } = body;
  if (feedback !== 1 && feedback !== -1) {
    return NextResponse.json({ error: 'feedback must be 1 or -1' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from('agent_runs')
    .update({ feedback })
    .eq('id', params.runId)
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
