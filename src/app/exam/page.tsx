"use client";

import { useState, useEffect, useCallback } from "react";
import { questions } from "@/types/question";
import { Question } from "@/types/question";
import { DifficultyBadge } from "@/features/quiz/components/DifficultyBadge";
import { normalizeAnswer } from "@/features/quiz/utils/normalizeAnswer";

export default function ExamPage() {
  // Get only exam questions (type: "exam")
  const examQuestions = questions.filter((q) => q.type === "exam");
  
  // Shuffle questions at component mount
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [examFinished, setExamFinished] = useState(false);
  const [answersMap, setAnswersMap] = useState<Record<number, string>>({});

  // Shuffle on mount
  useEffect(() => {
    const shuffled = [...examQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (examFinished || shuffledQuestions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setExamFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examFinished, shuffledQuestions.length]);

  const currentQuestion =
    shuffledQuestions.length > 0 ? shuffledQuestions[currentIndex] : null;

  const handleSelectAnswer = (option: string) => {
    if (answered || examFinished) return;

    setSelectedAnswer(option);
    setAnswered(true);

    // Check if correct
    const isCorrect =
      normalizeAnswer(option) === normalizeAnswer(currentQuestion!.answer);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Save answer
    setAnswersMap((prev) => ({
      ...prev,
      [currentQuestion!.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setExamFinished(true);
    }
  };

  const handleFinishExam = () => {
    setExamFinished(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const timeWarning = timeLeft < 5 * 60; // Red warning at < 5 mins
  const criticalTime = timeLeft < 1 * 60; // Critical at < 1 min

  if (shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (examFinished) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Exam Finished</h1>

          <div
            className={`rounded-lg p-6 mb-6 ${
              passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="text-5xl font-bold mb-2">
              {passed ? "✅" : "❌"}
            </div>
            <p
              className={`text-4xl font-bold ${
                passed ? "text-green-700" : "text-red-700"
              }`}
            >
              {score} / {shuffledQuestions.length}
            </p>
            <p
              className={`text-xl font-semibold ${
                passed ? "text-green-700" : "text-red-700"
              }`}
            >
              {percentage}%
            </p>
          </div>

          <p
            className={`text-lg mb-6 ${
              passed ? "text-green-700" : "text-red-700"
            }`}
          >
            {passed ? "🎉 Congratulations! You passed!" : "⚠️ Did not pass"}
          </p>

          <p className="text-gray-600 mb-8">
            Passing score: 60% ({Math.ceil(shuffledQuestions.length * 0.6)}/{shuffledQuestions.length})
          </p>

          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / shuffledQuestions.length) * 100;
  const isCorrect =
    answered &&
    normalizeAnswer(selectedAnswer!) ===
      normalizeAnswer(currentQuestion!.answer);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with timer */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Aptitude Exam
          </h1>
          <div
            className={`text-2xl font-bold font-mono px-4 py-2 rounded-lg ${
              criticalTime
                ? "bg-red-600 text-white"
                : timeWarning
                  ? "bg-orange-500 text-white"
                  : "bg-blue-600 text-white"
            }`}
          >
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Question {currentIndex + 1} of {shuffledQuestions.length}
            </span>
            <span className="text-sm font-semibold text-gray-700">
              Score: {score}/{currentIndex + (answered ? 1 : 0)}
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
          {/* Difficulty badge */}
          <div className="mb-4">
            <DifficultyBadge difficulty={currentQuestion!.difficulty} size="sm" />
          </div>

          {/* Question text */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
            {currentQuestion!.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion!.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const optionIsCorrect =
                normalizeAnswer(option) ===
                normalizeAnswer(currentQuestion!.answer);

              let buttonClass =
                "w-full p-4 text-left border-2 rounded-lg transition-all font-semibold cursor-";

              if (!answered) {
                buttonClass +=
                  "pointer border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-800";
              } else {
                if (optionIsCorrect) {
                  buttonClass +=
                    "not-allowed border-green-500 bg-green-100 text-green-900";
                } else if (isSelected) {
                  buttonClass +=
                    "not-allowed border-red-500 bg-red-100 text-red-900";
                } else {
                  buttonClass +=
                    "not-allowed border-gray-300 bg-gray-50 text-gray-800";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={answered || examFinished}
                  className={buttonClass}
                >
                  <span className="inline-block mr-3 font-bold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                  {answered && optionIsCorrect && (
                    <span className="ml-auto">✅</span>
                  )}
                  {answered && isSelected && !optionIsCorrect && (
                    <span className="ml-auto">❌</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Exam-specific styling: NO EXPLANATIONS, NO SHORTCUTS */}
          {answered && (
            <div
              className={`p-4 rounded-lg font-semibold text-center ${
                isCorrect
                  ? "bg-green-100 text-green-900"
                  : "bg-red-100 text-red-900"
              }`}
            >
              {isCorrect ? "✅ Correct!" : "❌ Wrong"}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex gap-4">
            {currentIndex < shuffledQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!answered}
                className={`flex-1 py-3 px-4 rounded-lg font-bold transition ${
                  answered
                    ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleFinishExam}
                disabled={!answered}
                className={`flex-1 py-3 px-4 rounded-lg font-bold transition ${
                  answered
                    ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Finish Exam ✓
              </button>
            )}
          </div>
        </div>

        {/* Warning message */}
        {criticalTime && (
          <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 text-red-900 font-bold text-center">
            ⚠️ Less than 1 minute remaining! Hurry up!
          </div>
        )}
        {timeWarning && !criticalTime && (
          <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-4 text-orange-900 font-bold text-center">
            ⚠️ Less than 5 minutes remaining
          </div>
        )}
      </div>
    </div>
  );
}
