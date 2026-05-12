interface ExplanationBoxProps {
  isCorrect: boolean;
  explanation: string;
  shortcut: string;
  steps?: string[];
  formula?: string;
}

export function ExplanationBox({
  isCorrect,
  explanation,
  shortcut,
  steps,
  formula,
}: ExplanationBoxProps) {
  return (
    <div className="mt-6 bg-zinc-800 p-4 rounded-xl space-y-4">
      {/* Result Status */}
      <p className="mb-2">
        {isCorrect ? (
          <span className="text-green-400 font-semibold">Correct Answer ✅</span>
        ) : (
          <span className="text-red-400 font-semibold">Wrong Answer ❌</span>
        )}
      </p>

      {/* Steps if available, otherwise explanation */}
      {steps && steps.length > 0 ? (
        <div className="space-y-2">
          <p className="text-zinc-300 font-semibold text-sm">Step-by-Step Solution</p>
          {steps.map((step, idx) => (
            <div key={idx} className="bg-zinc-700/50 p-2 rounded border-l-2 border-blue-500">
              <p className="text-zinc-300 text-sm">{step}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-300 text-sm">{explanation}</p>
      )}

      {/* Formula if available */}
      {formula && (
        <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
          <p className="text-blue-300 font-semibold mb-1 text-sm">Formula</p>
          <p className="text-zinc-300 text-sm font-mono">{formula}</p>
        </div>
      )}

      {/* Shortcut/Trick */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
        <p className="text-yellow-300 font-semibold mb-1 text-sm">Fastest Trick ⚡</p>
        <p className="text-zinc-300 text-sm">{shortcut}</p>
      </div>
    </div>
  );
}