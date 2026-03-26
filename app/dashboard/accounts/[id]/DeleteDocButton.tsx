'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteDocButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-stone-600 hover:text-red-400 transition-colors disabled:opacity-50"
      title="Delete document"
    >
      {loading ? '…' : '✕'}
    </button>
  );
}
