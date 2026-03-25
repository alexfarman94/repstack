import { tools } from '@/data/tools';
import { ToolsGrid } from '@/components/ToolsGrid';

export const metadata = {
  title: 'All Tools — Rep Stack',
  description: 'Browse AI tools for Account Executives, BDRs, and Sales Engineers.',
};

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">All tools</h1>
        <p className="text-stone-400">
          Filter by role or format. Every tool is free to use — copy, download, or open directly.
        </p>
      </div>
      <ToolsGrid tools={tools} />
    </div>
  );
}
