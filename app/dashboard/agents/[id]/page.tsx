import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ToolInput } from '@/lib/types';
import { AgentRunner } from './AgentRunner';
import { DeleteAgentButton } from './DeleteAgentButton';

export default async function AgentDetailPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();

  const [{ data: agent }, { data: accounts }] = await Promise.all([
    supabase
      .from('agents')
      .select('id, name, description, inputs, created_at')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single(),
    supabase
      .from('accounts')
      .select('id, company_name')
      .eq('user_id', userId)
      .order('company_name'),
  ]);

  if (!agent) notFound();

  const inputs = (agent.inputs as ToolInput[]) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/dashboard/agents" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Agents
            </Link>
            <span>/</span>
            <span className="text-slate-400">{agent.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{agent.name}</h1>
          {agent.description && (
            <p className="text-slate-500 mt-1 text-sm">{agent.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <DeleteAgentButton id={params.id} name={agent.name} />
        </div>
      </div>

      {/* Runner */}
      <AgentRunner
        agentId={params.id}
        inputs={inputs}
        accounts={accounts ?? []}
      />
    </div>
  );
}
