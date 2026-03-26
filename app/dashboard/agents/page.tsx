import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

export default async function AgentsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My agents</h1>
          <p className="text-stone-400 mt-1 text-sm">
            Custom AI tools you&apos;ve built. Each one can run against any account in your knowledge base.
          </p>
        </div>
        <Link
          href="/dashboard/agents/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-2 text-sm transition-colors shrink-0"
        >
          <span className="text-lg leading-none">+</span> New agent
        </Link>
      </div>

      {!agents?.length ? (
        <div className="rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] p-10 text-center">
          <p className="text-stone-300 font-medium">No agents yet</p>
          <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
            Build a custom agent with plain-English instructions and optional input fields.
            Run it against any account in your knowledge base — no manual pasting required.
          </p>
          <Link
            href="/dashboard/agents/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 text-sm transition-colors"
          >
            Build your first agent
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/dashboard/agents/${agent.id}`}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 hover:bg-white/[0.04] transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-white">{agent.name}</p>
                <span className="text-xs text-stone-600 shrink-0">
                  {new Date(agent.created_at).toLocaleDateString()}
                </span>
              </div>
              {agent.description && (
                <p className="text-sm text-stone-500 mt-1.5 line-clamp-2">{agent.description}</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-indigo-400">Run agent →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
