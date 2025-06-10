// File: pages/blog2.tsx
import Link from 'next/link';

export default function Blog2() {
  return (
    <main className="min-h-screen px-6 py-12 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">The Invisible Burden of Reading Legal Judgments</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">📅 May 2025</p>

        <p className="mb-4">
          For years, law students and junior advocates have struggled through endless pages of judgments.
          We copy-paste from SCC Online, Manupatra, or court websites… then read… re-read… summarize by hand.
        </p>

        <p className="mb-4">
          It’s exhausting. While legal knowledge is essential, the system makes it inefficient. 
          Reading judgments should feel like gaining insight — not surviving a punishment.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">🤖 Where AI Comes In</h2>

        <p className="mb-4">
          At <strong>VerdictForge</strong>, we’re not replacing lawyers. 
          We’re removing the friction between you and legal understanding.
        </p>

        <p className="mb-4">
          Think of us as your personal legal intern who reads fast, writes crisply, and never complains.
        </p>

        <p className="mb-8">
          With every summary we generate, we’re giving time back to law students, researchers, and overworked professionals.
          This is legal productivity — built for India.
        </p>

        <p className="italic text-sm">Made with ❤️ by Parthiv</p>

        <div className="mt-10">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
