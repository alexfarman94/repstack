import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admin</h1>
            <p className="text-sm text-slate-500">Platform agent management</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            Back to Workspace
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
