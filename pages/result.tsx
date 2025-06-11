// pages/result.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Result() {
  const [summary, setSummary] = useState<{ legal: string; plain: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('verdict_summary');
      if (stored) {
        setSummary(JSON.parse(stored));
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700 dark:text-white">
        <p>Loading...</p>
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700 dark:text-white">
        <div className="text-center">
          <p>No summary found. Please go back and generate one.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const copyToClipboard = () => {
    const text = `📘 Legal Summary:\n${summary.legal}\n\n💬 Plain English Summary:\n${summary.plain}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧾 Summary</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">📘 Legal Summary</h2>
          <p className="whitespace-pre-line bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl border dark:border-zinc-700">
            {summary.legal}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">💬 Plain English Summary</h2>
          <p className="whitespace-pre-line bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl border dark:border-zinc-700">
            {summary.plain}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            🔄 Summarize Another
          </button>

          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-green-600 text-white rounded-xl"
          >
            📋 Copy to Clipboard
          </button>
        </div>
      </div>
    </main>
  );
}
