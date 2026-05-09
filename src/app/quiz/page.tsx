"use client";

import { useState } from "react";
import { questions } from "@/data/questions";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = questions[currentQuestion];

  if (quizFinished) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md text-center">

        <h1 className="text-4xl font-bold mb-4">
          Sprint Completed 🚀
        </h1>

        <p className="text-2xl text-green-400 mb-2">
          {score} / {questions.length}
        </p>

        <p className="text-zinc-400 mb-6">
          Accuracy: {Math.round((score / questions.length) * 100)}%
        </p>

        <button
          onClick={() => {
            setCurrentQuestion(0);
            setScore(0);
            setQuizFinished(false);
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
            Question {currentQuestion + 1} / {questions.length}
          </p>

          <p className="text-yellow-400">30s</p>
          <p className="text-green-400">Score: {score}</p>
        </div>

        <h1 className="text-2xl font-bold mb-6">
          {question.question}
        </h1>

        <div className="flex flex-col gap-4">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedAnswer(option)}
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

        <button
          onClick={() => {
            if (selectedAnswer === question.answer) {
              setScore(score + 1);
            }
            setSelectedAnswer("");
            if (currentQuestion + 1 < questions.length){
                setCurrentQuestion(currentQuestion + 1);
            }else{
                setQuizFinished(true);
            }
          }}
          className="w-full mt-8 bg-white text-black py-3 rounded-xl font-semibold"
        >
          Next Question
        </button>
      </div>
    </main>
  );
}