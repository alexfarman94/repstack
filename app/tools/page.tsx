import { tools } from '@/data/tools';
import { Tool } from '@/lib/types';
import { ToolsGrid } from '@/components/ToolsGrid';

export const metadata = {
  title: 'All Tools — Rep Stack',
  description: 'Browse live AI tools for Account Executives, BDRs, and Sales Engineers.',
};

export default function ToolsPage() {
  // Strip systemPrompt before passing to client component
  const publicTools: Tool[] = tools.map(({ systemPrompt: _sp, ...rest }) => rest as Tool);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">All tools</h1>
        <p className="text-stone-400">
          Filter by role or format. Fill in your context, hit Generate, and get something ready to use.
        </p>
      </div>
      <ToolsGrid tools={publicTools} />
    </div>
  );
}
