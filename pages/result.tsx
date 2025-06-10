// File: pages/result.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Result() {
  const [summary, setSummary] = useState<{ legal: string; plain: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('verdict_summary');
    if (stored) {
      setSummary(JSON.parse(stored));
    }
  }, []);

  if (!summary) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700 dark:text-white">
        <p>No summary found. Please go back and generate one.</p>
      </main>
    );
  }

  const handleCopy = () => {
    const text = `📘 Legal Summary:\n${summary.legal}\n\n💬 Plain English Summary:\n${summary.plain}`;
    navigator.clipboard.writeText(text);
    alert('✅ Summary copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob(
      [`📘 Legal Summary:\n${summary.legal}\n\n💬 Plain English Summary:\n${summary.plain}`],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'verdict_summary.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    router.push('/');
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
            onClick={handleBack}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            🔁 Try Another
          </button>

          <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            📋 Copy
          </button>

          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            📥 Download
          </button>
        </div>
      </div>
    </main>
  );
}
