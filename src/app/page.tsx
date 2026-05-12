import { getPhase1Categories } from "@/data/categories";
import Link from "next/link";

export default function Home() {
  const categories = getPhase1Categories();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-2">AptiSprint</h1>

      <p className="text-zinc-400 text-center max-w-lg mb-2">
        Master placement aptitude with curated questions across 13 core topics.
      </p>
      <p className="text-yellow-400 text-sm mb-6">
        Learn shortcuts. Practice strategically. Build confidence.
      </p>

      <div className="grid grid-cols-1 gap-3 w-full max-w-2xl">
        {/* Exam Mode Button */}
        <Link
          href="/exam"
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-center transition"
        >
          🎯 Start Test (30 min)
        </Link>

        <div className="h-px bg-zinc-700 my-2"></div>

        {/* Practice Modes */}
        <Link
          href="/quiz"
          className="bg-white text-black py-3 rounded-xl font-semibold text-center hover:bg-gray-200 transition"
        >
          Random Sprint
        </Link>

        {/* Dynamically Rendered Categories */}
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/quiz?topic=${encodeURIComponent(category.name)}`}
              className="border border-zinc-700 py-2 px-3 rounded-lg text-center hover:bg-zinc-900 transition text-sm"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Info section */}
        <div className="mt-6 p-4 border border-zinc-700 rounded-lg">
          <p className="text-xs text-zinc-400 text-center">
            Phase 1: 13 Core Topics | Total Questions: 195+ | All Curated & Verified
          </p>
        </div>
      </div>
    </main>
  );
}