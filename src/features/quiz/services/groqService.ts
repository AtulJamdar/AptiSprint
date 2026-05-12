import { Question, Difficulty } from "@/types/question";
import { CategoryName } from "@/data/categories";

interface GenerateQuestionParams {
  topic: CategoryName;
  difficulty: Difficulty;
}

export async function generateQuestion({
  topic,
  difficulty,
}: GenerateQuestionParams): Promise<Question> {
  const response = await fetch(
    "/api/generate-question",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        difficulty,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to generate question"
    );
  }

  const data = await response.json();

  return {
    id: Date.now(),
    topic,
    difficulty,
    type: "practice",
    question: data.question,
    options: data.options,
    answer: data.answer,
    explanation: data.explanation,
    steps: data.steps || [],
    formula: data.formula || "",
    shortcut: data.shortcut,
  };
}
