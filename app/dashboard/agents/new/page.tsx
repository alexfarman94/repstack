import { AgentBuilderForm } from './AgentBuilderForm';

export default function NewAgentPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Build an agent</h1>
        <p className="text-stone-400 mt-1 text-sm">
          Define a custom AI tool with plain-English instructions. Add optional input fields,
          then run it against any account in your knowledge base.
        </p>
      </div>
      <AgentBuilderForm />
    </div>
  );
}
