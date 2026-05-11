const testAPI = async () => {
  try {
    console.log("Testing API endpoint...");
    const response = await fetch("http://localhost:3000/api/generate-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: "Percentages",
        difficulty: "easy",
      }),
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
};

testAPI();
