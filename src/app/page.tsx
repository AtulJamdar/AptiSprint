export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-4">AptiSprint</h1>

      <p className="text-zinc-400 text-center max-w-md mb-8">
        Practice aptitude with 5-question timed sprints.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button className="bg-white text-black py-3 rounded-xl font-semibold">
          Start Sprint
        </button>

        <button className="border border-zinc-700 py-3 rounded-xl">
          Random Quiz
        </button>

        <button className="border border-zinc-700 py-3 rounded-xl">
          Weak Areas
        </button>
      </div>
    </main>
  );
}