interface ExplanationBoxProps {
  isCorrect: boolean;
  explanation: string;
  shortcut: string;
}

export function ExplanationBox({ isCorrect, explanation, shortcut }: ExplanationBoxProps) {
  return (
    <div className="mt-6 bg-zinc-800 p-4 rounded-xl">
      <p className="mb-2">
        {isCorrect ? (
          <span className="text-green-400 font-semibold">Correct Answer ✅</span>
        ) : (
          <span className="text-red-400 font-semibold">Wrong Answer ❌</span>
        )}
      </p>
      <p className="text-zinc-300 mb-3">{explanation}</p>
      <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
        <p className="text-yellow-300 font-semibold mb-1">Fastest Trick ⚡</p>
        <p className="text-zinc-300">{shortcut}</p>
      </div>
    </div>
  );
}