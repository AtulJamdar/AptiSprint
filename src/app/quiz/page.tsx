"use client";

import { useState, useEffect } from "react";
import { questions } from "@/data/questions";
import { useSearchParams } from "next/navigation";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [wrongTopics, setWrongTopics] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const selectedTopic = searchParams.get("topic");
  
  const filteredQuestions = selectedTopic
  ? questions.filter(
      (q) => q.topic === selectedTopic
    )
  : questions;

const question = filteredQuestions[currentQuestion];
  


  useEffect(() => {
    if (showExplanation || quizFinished) return;

    if (timeLeft === 0) {
        setShowExplanation(true);
        return;
    }

    const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
    },1000);

    return () => clearTimeout(timer);
    }, [timeLeft, showExplanation, quizFinished]);

    const weakTopic =
  wrongTopics.length > 0
    ? wrongTopics.sort(
        (a, b) =>
          wrongTopics.filter((v) => v === a).length -
          wrongTopics.filter((v) => v === b).length
      )[wrongTopics.length - 1]
    : null;

  if (quizFinished) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md text-center">

        <h1 className="text-4xl font-bold mb-4">
          Sprint Completed 🚀
        </h1>

        <p className="text-2xl text-green-400 mb-2">
          {score} / {filteredQuestions.length}
        </p>

        <p className="text-zinc-400 mb-6">
          Accuracy: {Math.round((score / filteredQuestions.length) * 100)}%
        </p>

        {weakTopic && (
  <p className="text-red-400 mb-6">
    Weak Area: {weakTopic}
  </p>
)}

        <button
          onClick={() => {
            setCurrentQuestion(0);
            setScore(0);
            setQuizFinished(false);
            setWrongTopics([]);
          }}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold"
        >
          Retry Sprint
        </button>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-zinc-900 rounded-2xl p-6">

        <div className="flex justify-between mb-6">
          <p className="text-zinc-400">
            Question {currentQuestion + 1} / {filteredQuestions.length}
          </p>

          <p className="text-yellow-400">{timeLeft}s</p>
          <p className="text-green-400">Score: {score}</p>
        </div>

        <h1 className="text-2xl font-bold mb-6">
          {question.question}
        </h1>

        <div className="flex flex-col gap-4">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelectedAnswer(option);
                setShowExplanation(true);
              }}
              disabled={showExplanation}
              className={`border p-4 rounded-xl text-left transition
    ${
      selectedAnswer === option
        ? "border-green-500 bg-green-500/20"
        : "border-zinc-700 hover:bg-zinc-800"
    }
  `}
            >
              {option}
            </button>
          ))}
        </div>

        {showExplanation && (
  <div className="mt-6 bg-zinc-800 p-4 rounded-xl">

    <p className="mb-2">
      {selectedAnswer === question.answer ? (
        <span className="text-green-400 font-semibold">
          Correct Answer ✅
        </span>
      ) : (
        <span className="text-red-400 font-semibold">
          Wrong Answer ❌
        </span>
      )}
    </p>

    <p className="text-zinc-300 mb-3">
      {question.explanation}
    </p>

    <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
      <p className="text-yellow-300 font-semibold mb-1">
        Fastest Trick ⚡
      </p>

      <p className="text-zinc-300">
        {question.shortcut}
      </p>
    </div>
  </div>
)}

        <button
          onClick={() => {
            if (selectedAnswer === question.answer) {
  setScore(score + 1);
} else {
  setWrongTopics((prev) => [
    ...prev,
    question.topic,
  ]);
}
            setSelectedAnswer("");
            if (currentQuestion + 1 < filteredQuestions.length){
                setCurrentQuestion(currentQuestion + 1);
            }else{
                setQuizFinished(true);
            }
            setTimeLeft(30);
            setShowExplanation(false);
          }}
          className="w-full mt-8 bg-white text-black py-3 rounded-xl font-semibold"
        >
          Next Question
        </button>
      </div>
    </main>
  );
}