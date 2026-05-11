import { NextResponse } from "next/server";

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
- Explanation must be step-by-step
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
  "shortcut": ""
}
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
