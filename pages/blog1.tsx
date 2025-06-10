// File: pages/blog1.tsx
import Link from 'next/link';

export default function Blog1() {
  return (
    <main className="min-h-screen px-6 py-12 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Why I Built VerdictForge — An AI Legal Summarizer for Indian Law Students</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">📅 May 2025</p>

        <p className="mb-4">
          In my first year at a government law college, I struggled with what many students silently face — judgment fatigue.
          Long, complex court decisions with confusing legal jargon. Hours spent reading just to understand one case.
        </p>

        <p className="mb-4">
          As a law student from a non-NLU college, I didn’t have seniors to guide me or law firm mentors to help. But I had one edge — curiosity.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">⚙️ Can AI Help Us Understand Judgments Faster?</h2>

        <p className="mb-4">
          I asked myself: What if an AI tool could explain judgments like a senior advocate — clearly, briefly, and usefully?
          That’s how VerdictForge was born.
        </p>

        <ul className="list-disc ml-6 mb-4">
          <li>Streamlit for UI</li>
          <li>Mistral-7B via OpenRouter for summarization</li>
        </ul>

        <p className="mb-4">
          VerdictForge breaks down court decisions into crisp legal summaries, gives plain English explanations,
          and focuses specifically on Indian judgments.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">🚀 Why This Matters for Law Students</h2>

        <p className="mb-4">
          VerdictForge is a study companion, a research booster, and a time-saver — especially for students from non-NLU backgrounds
          who want to level the playing field with AI.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">🌱 What’s Next</h2>

        <p className="mb-6">
          I want to grow VerdictForge into a full legal assistant:
        </p>

        <ul className="list-disc ml-6 mb-8">
          <li>Auto-detect legal issues</li>
          <li>Extract citations</li>
          <li>Support regional languages</li>
        </ul>

        <p className="italic text-sm">Made with ❤️ by Parthiv</p>

        <div className="mt-10">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
