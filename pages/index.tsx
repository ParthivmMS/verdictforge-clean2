// File: pages/index.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">⚖️ Welcome to VerdictForge</h1>
        <p className="text-lg mb-8">
          A legal AI summarizer built for Indian law students, interns, and professionals.
        </p>
        <Link href="/summarizer">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Start Summarizing
          </button>
        </Link>
        <div className="mt-10 text-sm text-zinc-500 dark:text-zinc-400">
          Made with ❤️ by Parthiv
        </div>
      </div>
    </main>
  );
}
