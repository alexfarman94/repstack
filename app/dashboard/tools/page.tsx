import { tools } from '@/data/tools';
import { ToolsGrid, type ToolPublic } from './ToolsGrid';

export default function DashboardToolsPage() {
  // Strip systemPrompt — keep only what the client needs to render cards and run tools
  const toolCards: ToolPublic[] = tools
    .filter((t) => t.format === 'embedded')
    .map(({ systemPrompt: _sp, content: _c, ...t }) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      hook: t.hook,
      personas: t.personas,
      inputs: t.inputs ?? [],
      format: t.format,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tools</h1>
        <p className="text-slate-500 mt-1 text-sm">
          {toolCards.length} AI tools built for sales reps. Select an opportunity to auto-inject your documents as context.
        </p>
      </div>
      <ToolsGrid tools={toolCards} />
    </div>
  );
}
