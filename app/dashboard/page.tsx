import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import type { ReactNode } from 'react';

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
  const hasDocs = (docCount ?? 0) > 0;

  // Derive step states
  const step1Status: StepStatus = hasAccounts ? 'completed' : 'active';
  const step2Status: StepStatus = hasDocs ? 'completed' : hasAccounts ? 'active' : 'locked';
  const step3Status: StepStatus = hasAccounts ? 'active' : 'locked';

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-1 text-sm">Your opportunities, documents, and AI agents in one place.</p>
      </div>

      {/* Persistent workflow card — always visible */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
        <div className="space-y-1.5 mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Your Rep Stack workflow</h2>
          <p className="text-sm text-slate-500">
            Add an opportunity, upload your documents, then run AI tools with real context.
          </p>
        </div>

        <div className="space-y-4">
          <OnboardingStep
            stepNumber="1"
            status={step1Status}
            title="Add an opportunity"
            description="A company you're actively working on"
            action={
              step1Status === 'completed' ? (
                <Link
                  href="/dashboard/accounts"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-4 py-2 text-sm transition-colors"
                >
                  View opportunities →
                </Link>
              ) : (
                <Link
                  href="/dashboard/accounts/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 text-sm transition-colors"
                >
                  Add opportunity →
                </Link>
              )
            }
          />

          <OnboardingStep
            stepNumber="2"
            status={step2Status}
            title="Upload your documents"
            description="Call transcripts, meeting notes, product briefs"
            action={
              step2Status === 'completed' ? (
                <Link
                  href={`/dashboard/knowledge-base/upload${accounts?.[0]?.id ? `?accountId=${accounts[0].id}` : ''}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-4 py-2 text-sm transition-colors"
                >
                  Upload more →
                </Link>
              ) : step2Status === 'active' ? (
                <Link
                  href={`/dashboard/knowledge-base/upload${accounts?.[0]?.id ? `?accountId=${accounts[0].id}` : ''}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 text-sm transition-colors"
                >
                  Upload documents →
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-50 text-slate-300 border border-slate-200 font-medium px-4 py-2 text-sm cursor-not-allowed"
                >
                  Upload documents
                </button>
              )
            }
          />

          <OnboardingStep
            stepNumber="3"
            status={step3Status}
            title="Run a tool"
            description="AI tools with your real context auto-loaded"
            action={
              step3Status === 'active' ? (
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 text-sm transition-colors"
                >
                  Browse tools →
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-50 text-slate-300 border border-slate-200 font-medium px-4 py-2 text-sm cursor-not-allowed"
                >
                  Browse tools
                </button>
              )
            }
          />
        </div>
      </div>

      {/* Returning-user sections — shown once they have accounts */}
      {hasAccounts && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard label="Opportunities" value={accounts?.length ?? 0} href="/dashboard/accounts" />
            <StatCard label="Documents" value={docCount ?? 0} href="/dashboard/accounts" />
            <StatCard label="Agents" value={agents?.length ?? 0} href="/dashboard/agents" />
          </div>

          {/* Recent opportunities */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                Recent opportunities
              </h2>
              <Link href="/dashboard/accounts" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              {accounts!.map((account) => (
                <Link
                  key={account.id}
                  href={`/dashboard/accounts/${account.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{account.company_name}</p>
                    {account.industry && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{account.industry}</p>
                    )}
                  </div>
                  <span className="text-slate-500 text-xs shrink-0">
                    {new Date(account.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
              Quick actions
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              <QuickAction
                href="/dashboard/accounts/new"
                title="Add opportunity"
                description="A company you're actively working on"
                icon="+"
              />
              <QuickAction
                href={`/dashboard/knowledge-base/upload?accountId=${accounts?.[0]?.id ?? ''}`}
                title="Upload documents"
                description="Call transcripts, meeting notes, product briefs"
                icon="↑"
              />
              <QuickAction
                href="/dashboard/agents/new"
                title="Build an agent"
                description="Create a custom AI assistant for your workflow"
                icon="⚡"
              />
            </div>
          </section>

          {/* My agents */}
          {hasAgents && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                  My agents
                </h2>
                <Link href="/dashboard/agents" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  View all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {agents!.map((agent) => (
                  <Link
                    key={agent.id}
                    href={`/dashboard/agents/${agent.id}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <p className="text-sm font-medium text-slate-900">{agent.name}</p>
                    {agent.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{agent.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

type StepStatus = 'completed' | 'active' | 'locked';

function OnboardingStep({
  stepNumber,
  title,
  description,
  action,
  status,
}: {
  stepNumber: string;
  title: string;
  description: string;
  action: ReactNode;
  status: StepStatus;
}) {
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-4 ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/40'
          : isLocked
          ? 'border-slate-200 bg-slate-50/50'
          : 'border-indigo-200 bg-indigo-50/30'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {/* Step indicator circle */}
        <div
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
            isCompleted
              ? 'bg-emerald-500 text-white'
              : isLocked
              ? 'bg-slate-200 text-slate-400'
              : 'bg-indigo-600 text-white'
          }`}
        >
          {isCompleted ? '✓' : stepNumber}
        </div>

        <div className="min-w-0">
          <p
            className={`text-xs font-semibold uppercase tracking-widest ${
              isCompleted ? 'text-emerald-600' : isLocked ? 'text-slate-400' : 'text-indigo-600'
            }`}
          >
            {isCompleted ? 'Completed' : `Step ${stepNumber}`}
          </p>
          <p
            className={`text-sm mt-1 ${
              isCompleted ? 'text-slate-600' : isLocked ? 'text-slate-400' : 'font-semibold text-slate-900'
            }`}
          >
            {title}
          </p>
          <p className={`text-xs mt-0.5 ${isLocked ? 'text-slate-300' : 'text-slate-500'}`}>
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0">{action}</div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 bg-white px-4 py-4 hover:bg-slate-50 transition-colors shadow-sm"
    >
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
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
      className="rounded-xl border border-slate-200 bg-white px-4 py-4 hover:bg-slate-50 transition-colors shadow-sm flex items-start gap-3"
    >
      <span className="shrink-0 w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-sm text-indigo-700">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </Link>
  );
}
