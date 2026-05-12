import { NextResponse } from "next/server";

function validateQuestion(data: any): string | null {
  // Check required fields
  if (!data.question || typeof data.question !== "string") {
    return "Missing or invalid question";
  }

  if (!Array.isArray(data.options) || data.options.length !== 4) {
    return "Options must be an array of exactly 4 items";
  }

  if (!data.answer || typeof data.answer !== "string") {
    return "Missing or invalid answer";
  }

  // Check for duplicate options
  const normalizedOptions = data.options.map((opt: string) =>
    opt.replace(/\$/g, "").replace(/,/g, "").trim().toLowerCase()
  );
  const uniqueOptions = new Set(normalizedOptions);
  if (uniqueOptions.size !== 4) {
    return "Options contain duplicates";
  }

  // Check if answer is in options
  const normalizedAnswer = data.answer
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .trim()
    .toLowerCase();
  const answerExists = normalizedOptions.some(
    (opt: string) => opt === normalizedAnswer
  );
  if (!answerExists) {
    return "Answer is not in the options";
  }

  if (!data.explanation || typeof data.explanation !== "string") {
    return "Missing or invalid explanation";
  }

  if (!data.shortcut || typeof data.shortcut !== "string") {
    return "Missing or invalid shortcut";
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { topic, difficulty } = body;

    if (!topic || !difficulty) {
      return NextResponse.json(
        { error: "Missing topic or difficulty" },
        { status: 400 }
      );
    }

    const prompt = `
Generate ONE aptitude multiple choice question.

Rules:
- Topic: ${topic}
- Difficulty: ${difficulty}
- 4 options only
- One correct answer
- ALL options must be different (no duplicates)
- Explanation must be clear and step-by-step
- Shortcut must be very short and useful
- Return ONLY valid JSON
- No markdown
- No extra text

JSON format:
{
  "question": "",
  "options": ["", "", "", ""],
  "answer": "",
  "explanation": "",
  "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "formula": "",
  "shortcut": ""
}

IMPORTANT: All 4 options must be unique. Do NOT duplicate any option text.
`;


    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      return NextResponse.json(
        { error: "Groq API error", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log("Groq Response:", JSON.stringify(data, null, 2));

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in Groq response:", data);
      return NextResponse.json(
        { error: "No content in AI response" },
        { status: 500 }
      );
    }

    // Try to extract JSON from the response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw parseError;
      }
    }

    // Validate question integrity
    const validationError = validateQuestion(parsed);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("API Route Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate question",
        details: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
