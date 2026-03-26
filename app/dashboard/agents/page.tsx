import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import { AgentCards } from './AgentCards';
import type { ToolInput } from '@/lib/types';

export default async function AgentsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, description, inputs, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Normalize inputs from JSON to ToolInput[]
  const agentCards = (agents ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    inputs: (a.inputs as ToolInput[]) ?? [],
    created_at: a.created_at,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agents</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Custom AI tools you&apos;ve built. Run any agent against an opportunity in your pipeline.
          </p>
        </div>
        <Link
          href="/dashboard/agents/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-2 text-sm transition-colors shrink-0"
        >
          <span className="text-lg leading-none">+</span> Build new
        </Link>
      </div>

      {!agentCards.length ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-900 font-medium">No agents yet</p>
          <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
            Build a custom agent with plain-English instructions and optional input fields.
            Run it against any opportunity — no manual pasting required.
          </p>
          <Link
            href="/dashboard/agents/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 text-sm transition-colors"
          >
            Build your first agent
          </Link>
        </div>
      ) : (
        <AgentCards agents={agentCards} />
      )}
    </div>
  );
}
