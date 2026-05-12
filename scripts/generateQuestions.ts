#!/usr/bin/env node

/**
 * Batch Question Generation Script
 * 
 * Usage:
 *   npx ts-node scripts/generateQuestions.ts <category>
 * 
 * Example:
 *   npx ts-node scripts/generateQuestions.ts "Simple Interest"
 * 
 * This script:
 * 1. Generates 15 questions (5 easy, 5 medium, 5 hard)
 * 2. Saves to temp file for manual review
 * 3. You verify quality before adding to production
 * 
 * Never generates live during user sessions!
 * Always batch-generate, review, then commit.
 */

import * as fs from "fs";
import * as path from "path";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error("❌ Error: GROQ_API_KEY environment variable not set");
  process.exit(1);
}

interface GeneratedQuestion {
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  steps?: string[];
  formula?: string;
  shortcut: string;
}

const categoryPrompts: Record<string, string> = {
  "Time, Speed & Distance": `Generate a DIFFICULTY level Quantitative Reasoning question about Time, Speed & Distance for placement exams. Include: distance/speed/time calculations, relative motion, or journey problems.`,
  "Simple Interest": `Generate a DIFFICULTY level Quantitative Reasoning question about Simple Interest for placement exams. Include: principal, rate, time, SI calculations, or investment problems.`,
  "Compound Interest": `Generate a DIFFICULTY level Quantitative Reasoning question about Compound Interest for placement exams. Include: compound growth, rates, periods, or investment calculations.`,
  "Average": `Generate a DIFFICULTY level Quantitative Reasoning question about Averages for placement exams. Include: mean, weighted average, or average of numbers.`,
  "Ages": `Generate a DIFFICULTY level Quantitative Reasoning question about Ages for placement exams. Include: age relationships, ratios, or age-based word problems.`,
  "Number Series": `Generate a DIFFICULTY level Quantitative Reasoning question about Number Series for placement exams. Include: sequence patterns, progressions, or missing numbers.`,
  "Permutation & Combination": `Generate a DIFFICULTY level Quantitative Reasoning question about Permutation & Combination for placement exams. Include: arrangements, selections, or counting principles.`,
  "Data Interpretation": `Generate a DIFFICULTY level Quantitative Reasoning question about Data Interpretation for placement exams. Include: tables, graphs, or chart analysis.`,
};

async function generateQuestionsForCategory(category: string): Promise<void> {
  console.log(`\n📚 Generating questions for: ${category}`);
  console.log(`Batch: 5 Easy + 5 Medium + 5 Hard = 15 questions\n`);

  const allQuestions: GeneratedQuestion[] = [];

  for (const difficulty of ["easy", "medium", "hard"] as const) {
    console.log(`⏳ Generating ${difficulty} questions...`);

    const promptTemplate =
      categoryPrompts[category] ||
      `Generate a DIFFICULTY level Quantitative Reasoning question about ${category} for placement exams.`;

    const prompt = promptTemplate.replace("DIFFICULTY", difficulty);

    const fullPrompt = `${prompt}

CRITICAL: Return EXACTLY this JSON format with NO other text:
{
  "question": "Clear question text",
  "options": ["A", "B", "C", "D"],
  "answer": "One of the options",
  "explanation": "Detailed step-by-step solution",
  "steps": ["Step 1", "Step 2", ...],
  "formula": "Any relevant formula (optional)",
  "shortcut": "Quick solving tip if applicable"
}

Generate 5 DIFFERENT questions of ${difficulty} difficulty. Return as JSON array.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: fullPrompt }],
          temperature: 1,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(`❌ API Error: ${error.error?.message || "Unknown error"}`);
        continue;
      }

      const data = (await response.json()) as Record<string, any>;
      const choices = data.choices as Array<{ message: { content: string } }>;
      const content = choices?.[0]?.message?.content || "";

      // Extract JSON from response (may have markdown code blocks)
      const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(`❌ No JSON found in response for ${difficulty}`);
        continue;
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const questions = Array.isArray(parsed) ? parsed : [parsed];

      for (const q of questions) {
        allQuestions.push({
          difficulty,
          question: q.question,
          options: q.options || [],
          answer: q.answer,
          explanation: q.explanation,
          steps: q.steps,
          formula: q.formula,
          shortcut: q.shortcut || "",
        });
      }

      console.log(`✅ Generated 5 ${difficulty} questions`);
    } catch (error) {
      console.error(`❌ Error generating ${difficulty} questions:`, error);
    }
  }

  // Save to file for review
  const reviewFile = path.join(
    process.cwd(),
    `generated_questions_${category.replace(/\s+/g, "_")}.json`
  );

  fs.writeFileSync(reviewFile, JSON.stringify(allQuestions, null, 2));

  console.log(`\n✅ Questions saved to: ${reviewFile}`);
  console.log("\n📋 NEXT STEPS:");
  console.log("1. Open the file above");
  console.log("2. Review each question for:");
  console.log("   - Correctness of answer");
  console.log("   - Clarity of explanation");
  console.log("   - Proper 4 options (no duplicates)");
  console.log("3. After manual verification, add to src/types/question.ts");
  console.log("4. Update question IDs and ensure they don't conflict\n");
}

// Main execution
const category = process.argv[2];

if (!category) {
  console.error("❌ Category name required");
  console.error("\nUsage: npx ts-node scripts/generateQuestions.ts <category>");
  console.error("\nAvailable categories:");
  console.error("  - Time, Speed & Distance");
  console.error("  - Simple Interest");
  console.error("  - Compound Interest");
  console.error("  - Average");
  console.error("  - Ages");
  console.error("  - Number Series");
  console.error("  - Permutation & Combination");
  console.error("  - Data Interpretation\n");
  process.exit(1);
}

generateQuestionsForCategory(category);
