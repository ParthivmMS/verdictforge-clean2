// pages/about.tsx
import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About – VerdictForge</title>
      </Head>
      <div className="max-w-2xl mx-auto mt-8 text-zinc-800 dark:text-zinc-200">
        <h1 className="text-3xl font-bold mb-4">ℹ️ About VerdictForge</h1>
        <p className="mb-4">
          VerdictForge is an AI-powered legal judgment summarizer designed by a law student in India to simplify the understanding of complex court rulings.
        </p>
        <p className="mb-4">
          It provides dual-format summaries – a professional legal breakdown and a simple plain-English explanation. Ideal for law students, interns, and professionals who need clarity and speed.
        </p>
        <p className="mb-4">
          Built using Next.js, TailwindCSS, and powerful AI APIs, this project aims to bridge the gap between legal complexity and public understanding.
        </p>
      </div>
    </>
  );
}
