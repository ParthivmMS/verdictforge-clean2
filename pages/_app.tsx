// pages/_app.tsx
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar'; // ✅ Capital S

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <>
      <Head>
        <title>VerdictForge – Indian Legal Judgment Summarizer</title>
        <meta
          name="description"
          content="Summarize Indian legal judgments using AI. Legal and plain-English summaries built for law students and professionals."
        />
        <link rel="icon" href="/favicon.ico" />
        {/* ✅ Google AdSense script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1762689473102041"
          crossOrigin="anonymous"
        ></script>
      </Head>

      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 bg-white dark:bg-black text-black dark:text-white">
          <div className="fixed top-4 right-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-sm"
            >
              Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}
