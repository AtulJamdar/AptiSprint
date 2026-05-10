import { questions } from "@/types/question";
import Link from "next/link";
export default function Home() {
  const topics = [
    "Percentages",
    "Profit & Loss",
    "Ratio",
    "Time & Work",
    "Probability",
  ];
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-4">AptiSprint</h1>

      <p className="text-zinc-400 text-center max-w-md mb-8">
  Improve placement aptitude with fast 5-question timed practice rounds.
</p>
<p className="text-yellow-400 text-sm mb-8">
  Learn shortcuts. Beat the timer. Track weak areas.
</p>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">

  <Link
    href="/quiz"
    className="bg-white text-black py-3 rounded-xl font-semibold text-center"
  >
    Random Sprint
  </Link>

  {topics.map((topic) => (
    <Link
      key={topic}
      href={`/quiz?topic=${encodeURIComponent(topic)}`}
      className="border border-zinc-700 py-3 rounded-xl text-center hover:bg-zinc-900 transition"
    >
      {topic}
    </Link>
  ))}
</div>
    </main>
  );
}