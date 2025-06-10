// File: pages/blog3.tsx
import Link from 'next/link';

export default function Blog3() {
  return (
    <main className="min-h-screen px-6 py-12 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">How AI Can Help Law Students From Non-NLU Colleges</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">📅 May 2025</p>

        <p className="mb-4">
          Let’s face it: the legal world in India is deeply tiered.
          National Law University (NLU) students often get better internships, more exposure, and stronger networks.
        </p>

        <p className="mb-4">
          But what about the rest of us? I study in a government law college. 
          I don’t have the alumni power or firm contacts. But I have one edge — <strong>technology</strong>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">⚖️ Why VerdictForge Matters</h2>

        <ul className="list-disc ml-6 mb-4">
          <li>Read judgments faster</li>
          <li>Understand complex decisions in plain English</li>
          <li>Save time for moots, writing, internships</li>
        </ul>

        <p className="mb-4">
          AI doesn’t care where you study. It levels the playing field.
        </p>

        <p className="mb-4">
          My dream is to make legal tech accessible to every student — especially from non-NLU backgrounds.
          If we use AI smartly, we can stand out based on skill — not brand.
        </p>

        <p className="italic text-sm">Made with ❤️ by Parthiv</p>

        <div className="mt-10">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
