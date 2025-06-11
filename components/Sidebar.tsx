// components/Sidebar.tsx
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-60 h-screen bg-zinc-900 text-white fixed left-0 top-0 p-6 space-y-4">
      <h1 className="text-xl font-bold mb-6">🧠 VerdictForge</h1>
      <nav className="space-y-2">
        <Link href="/">
          <span className="block hover:text-blue-400">🧾 Summarizer</span>
        </Link>
        <Link href="/blog1">
          <span className="block hover:text-blue-400">📝 Blog 1</span>
        </Link>
        <Link href="/blog2">
          <span className="block hover:text-blue-400">📝 Blog 2</span>
        </Link>
        <Link href="/blog3">
          <span className="block hover:text-blue-400">📝 Blog 3</span>
        </Link>
        <Link href="/privacy">
          <span className="block hover:text-blue-400">🛡️ Privacy Policy</span>
        </Link>
        <Link href="/about">
          <span className="block hover:text-blue-400">📄 About</span>
        </Link>
      </nav>
    </div>
  );
}
