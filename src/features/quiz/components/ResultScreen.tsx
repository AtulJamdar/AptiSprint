interface ResultScreenProps {
  score: number;
  total: number;
  weakTopic: string | null;
  onRetry: () => void;
}

export function ResultScreen({ score, total, weakTopic, onRetry }: ResultScreenProps) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">Sprint Completed 🚀</h1>
        <p className="text-2xl text-green-400 mb-2">{score} / {total}</p>
        <p className="text-zinc-400 mb-4">
          Accuracy: {Math.round((score / total) * 100)}%
        </p>

        {weakTopic && (
          <p className="text-red-400 mb-6">Weak Area: {weakTopic}</p>
        )}

        <button
          onClick={onRetry}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold"
        >
          Retry Sprint
        </button>

        <a href="/" className="block mt-4 text-zinc-400 hover:text-white transition">
          Back to Home
        </a>
      </div>
    </main>
  );
}