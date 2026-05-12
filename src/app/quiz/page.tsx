"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { questions, Question } from "@/types/question";
import { useTimer } from "@/features/quiz/hooks/useTimer";
import { ResultScreen } from "@/features/quiz/components/ResultScreen";
import { ExplanationBox } from "@/features/quiz/components/ExplanationBox";
import { DifficultyBadge } from "@/features/quiz/components/DifficultyBadge";
import { generateQuestion } from "@/features/quiz/services/groqService";
import LoadingState from "@/features/quiz/components/LoadingState";
import { normalizeAnswer } from "@/features/quiz/utils/normalizeAnswer";

function QuizContent() {
  const searchParams = useSearchParams();
  const selectedTopic = searchParams.get("topic");

  // Logic: Filtering
  const filteredQuestions = useMemo(() => 
    selectedTopic ? questions.filter((q) => q.topic === selectedTopic) : questions
  , [selectedTopic]);

  // State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [wrongTopics, setWrongTopics] = useState<string[]>([]);
  const [generatedQuestion, setGeneratedQuestion] = useState<Question | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const question =
    generatedQuestion ||
    filteredQuestions[currentQuestion];

  // Logic: Timer Hook
  const { timeLeft, resetTimer } = useTimer(
    30, 
    () => setShowExplanation(true), 
    showExplanation || quizFinished
  );

  // Logic: Weak Topic Calculation
  const weakTopic = useMemo(() => {
    if (wrongTopics.length === 0) return null;
    return [...wrongTopics].sort((a, b) =>
      wrongTopics.filter((v) => v === a).length - wrongTopics.filter((v) => v === b).length
    ).pop() || null;
  }, [wrongTopics]);

  const handleNext = () => {
    if (normalizeAnswer(selectedAnswer) === normalizeAnswer(question.answer)) {
      setScore(score + 1);
    } else {
      setWrongTopics((prev) => [...prev, question.topic]);
    }

    if (currentQuestion + 1 < filteredQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setShowExplanation(false);
      resetTimer();
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    return (
      <ResultScreen 
        score={score} 
        total={filteredQuestions.length} 
        weakTopic={weakTopic} 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-zinc-900 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-zinc-400">Question {currentQuestion + 1} / {filteredQuestions.length}</p>
          <div className="flex items-center gap-4">
            <DifficultyBadge difficulty={question.difficulty} size="sm" />
            <p className="text-yellow-400">{timeLeft}s</p>
          </div>
        </div>

        <p className="text-green-400 mb-2">Score: {score}</p>
        <h1 className="text-2xl font-bold mb-6">{question.question}</h1>

        <div className="flex flex-col gap-4">
          {question.options.map((option) => (
            <button
              key={option}
              disabled={showExplanation}
              onClick={() => {
                setSelectedAnswer(option);
                setShowExplanation(true);
              }}
              className={`border p-4 rounded-xl text-left transition ${
                selectedAnswer === option ? "border-green-500 bg-green-500/20" : "border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showExplanation && (
          <ExplanationBox 
            isCorrect={normalizeAnswer(selectedAnswer) === normalizeAnswer(question.answer)}
            explanation={question.explanation}
            shortcut={question.shortcut}
            steps={question.steps}
            formula={question.formula}
          />
        )}

        <button
          onClick={async () => {
            try {
              setIsGenerating(true);
              setGenerationError(null);

              const newQuestion =
                await generateQuestion({
                  topic: question.topic,
                  difficulty: question.difficulty,
                });

              setGeneratedQuestion(newQuestion);

              setSelectedAnswer("");
              setShowExplanation(false);
              resetTimer();

            } catch (error) {
              const errorMessage = error instanceof Error 
                ? error.message 
                : "Failed to generate question. Please try again.";
              setGenerationError(errorMessage);
              console.error(error);
            } finally {
              setIsGenerating(false);
            }
          }}
          disabled={isGenerating}
          className="w-full mt-4 border border-yellow-500 text-yellow-400 py-3 rounded-xl hover:bg-yellow-500/10 transition disabled:opacity-50"
        >
          Generate Similar Question
        </button>

        {isGenerating && <LoadingState />}

        {generationError && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-xl">
            <p className="text-red-400 text-sm mb-2">{generationError}</p>
            <button
              onClick={async () => {
                try {
                  setGenerationError(null);
                  setIsGenerating(true);

                  const newQuestion =
                    await generateQuestion({
                      topic: question.topic,
                      difficulty: question.difficulty,
                    });

                  setGeneratedQuestion(newQuestion);
                  setSelectedAnswer("");
                  setShowExplanation(false);
                  resetTimer();

                } catch (error) {
                  const errorMessage = error instanceof Error 
                    ? error.message 
                    : "Failed to generate question. Please try again.";
                  setGenerationError(errorMessage);
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating}
              className="text-red-400 hover:text-red-300 text-sm underline"
            >
              Retry
            </button>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full mt-8 bg-white text-black py-3 rounded-xl font-semibold"
        >
          Next Question
        </button>
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent />
    </Suspense>
  );
}