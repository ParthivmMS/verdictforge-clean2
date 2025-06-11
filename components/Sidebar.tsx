// components/Sidebar.tsx
import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg lg:hidden"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 text-white p-6 space-y-4 z-40 transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:block`}
      >
        <h1 className="text-xl font-bold mb-6">📚 VerdictForge</h1>
        <nav className="space-y-2">
          <Link href="/"><span className="block hover:text-blue-400">⚖️ Summarizer</span></Link>
          <Link href="/blog1"><span className="block hover:text-blue-400">📝 Blog 1</span></Link>
          <Link href="/blog2"><span className="block hover:text-blue-400">📝 Blog 2</span></Link>
          <Link href="/blog3"><span className="block hover:text-blue-400">📝 Blog 3</span></Link>
          <Link href="/privacy"><span className="block hover:text-blue-400">🔒 Privacy Policy</span></Link>
          <Link href="/about"><span className="block hover:text-blue-400">ℹ️ About</span></Link>
        </nav>
      </div>
    </>
  );
}
