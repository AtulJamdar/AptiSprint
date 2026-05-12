const testAnswerNormalization = async () => {
  try {
    console.log("Testing answer normalization...\n");
    const response = await fetch("http://localhost:3000/api/generate-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: "Profit & Loss",
        difficulty: "medium",
      }),
    });

    const data = await response.json();
    
    console.log("Generated Question:");
    console.log("Question:", data.question);
    console.log("Options:", data.options);
    console.log("Answer:", data.answer);
    console.log("\nSteps:");
    data.steps?.forEach((step, i) => console.log(`  ${i + 1}. ${step}`));
    console.log("\nFormula:", data.formula);
    console.log("Shortcut:", data.shortcut);
    
    // Test normalization
    const { normalizeAnswer } = await import("./src/features/quiz/utils/normalizeAnswer.ts");
    
    console.log("\n--- Testing Answer Normalization ---");
    console.log(`Original answer: "${data.answer}"`);
    console.log(`Normalized: "${normalizeAnswer(data.answer)}"`);
    
    // Test with slight variations
    const variations = [
      data.answer,
      data.answer.replace(/\$/g, ""),
      data.answer.toLowerCase(),
      data.answer.replace(/\$/g, "").toLowerCase(),
    ];
    
    console.log("\nVariations all normalize correctly:");
    variations.forEach(v => {
      console.log(`  "${v}" → "${normalizeAnswer(v)}"`);
    });
    
  } catch (error) {
    console.error("Error:", error.message);
  }
};

testAnswerNormalization();
