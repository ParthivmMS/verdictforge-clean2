// pages/privacy.tsx
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy – VerdictForge</title>
      </Head>
      <div className="max-w-2xl mx-auto mt-8 text-zinc-800 dark:text-zinc-200">
        <h1 className="text-3xl font-bold mb-4">🔐 Privacy Policy</h1>
        <p className="mb-4">
          VerdictForge does not store or share any legal texts or summaries provided by users. All processing is done in real-time using AI and is not logged or saved.
        </p>
        <p className="mb-4">
          This tool is intended only for informational and educational purposes. It does not constitute legal advice. We are not liable for how the generated summaries are used.
        </p>
        <p className="text-sm text-zinc-500">
          Last updated: June 2025
        </p>
      </div>
    </>
  );
}
