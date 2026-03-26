import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();

  // Fetch recent accounts + counts in parallel
  const [{ data: accounts }, { data: agents }, { count: docCount }] = await Promise.all([
    supabase
      .from('accounts')
      .select('id, company_name, industry, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('agents')
      .select('id, name, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);

  const hasAccounts = (accounts?.length ?? 0) > 0;
  const hasAgents = (agents?.length ?? 0) > 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-stone-400 mt-1 text-sm">
          Your knowledge base, accounts, and agents — all in one place.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Accounts" value={accounts?.length ?? 0} href="/dashboard/accounts" />
        <StatCard label="Documents" value={docCount ?? 0} href="/dashboard/knowledge-base" />
        <StatCard label="Agents" value={agents?.length ?? 0} href="/dashboard/agents" />
      </div>

      {/* Empty state — first-run prompt */}
      {!hasAccounts && (
        <div className="rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] p-8 text-center">
          <p className="text-stone-300 font-medium">Set up your first account</p>
          <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
            Accounts represent companies in your pipeline. Once created, you can attach
            transcripts, notes, and product docs — then run any tool with full context
            auto-injected.
          </p>
          <Link
            href="/dashboard/accounts/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 text-sm transition-colors"
          >
            Create an account
          </Link>
        </div>
      )}

      {/* Recent accounts */}
      {hasAccounts && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-widest">
              Recent accounts
            </h2>
            <Link href="/dashboard/accounts" className="text-xs text-indigo-400 hover:text-indigo-300">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] overflow-hidden">
            {accounts!.map((account) => (
              <Link
                key={account.id}
                href={`/dashboard/accounts/${account.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-white">{account.company_name}</p>
                  {account.industry && (
                    <p className="text-xs text-stone-500 mt-0.5">{account.industry}</p>
                  )}
                </div>
                <span className="text-stone-600 text-xs">
                  {new Date(account.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick actions */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-widest">
          Quick actions
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <QuickAction
            href="/dashboard/accounts/new"
            title="Add account"
            description="Create a new company in your pipeline"
            icon="+"
          />
          <QuickAction
            href="/dashboard/knowledge-base/upload"
            title="Upload document"
            description="Add a transcript, brief, or notes"
            icon="↑"
          />
          <QuickAction
            href="/dashboard/agents/new"
            title="Build an agent"
            description="Create a custom AI tool for your workflow"
            icon="⚡"
          />
        </div>
      </section>

      {/* My agents */}
      {hasAgents && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-widest">
              My agents
            </h2>
            <Link href="/dashboard/agents" className="text-xs text-indigo-400 hover:text-indigo-300">
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {agents!.map((agent) => (
              <Link
                key={agent.id}
                href={`/dashboard/agents/${agent.id}`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-colors"
              >
                <p className="text-sm font-medium text-white">{agent.name}</p>
                {agent.description && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{agent.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 hover:bg-white/[0.04] transition-colors"
    >
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-stone-500 mt-1">{label}</p>
    </Link>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 hover:bg-white/[0.04] transition-colors flex items-start gap-3"
    >
      <span className="shrink-0 w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-sm text-stone-300">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-stone-500 mt-0.5">{description}</p>
      </div>
    </Link>
  );
}
