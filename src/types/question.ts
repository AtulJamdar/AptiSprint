export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  shortcut: string;
}

export const questions: Question[] = [
  {
    id: 1,
    topic: "Percentages",
    difficulty: "easy",
    question: "What is 20% of 250?",
    options: ["25", "50", "75", "100"],
    answer: "50",
    explanation:
      "10% of 250 is 25. Double it for 20% = 50.",
    shortcut:
      "Find 10% first, then multiply quickly.",
  },

  {
    id: 2,
    topic: "Profit & Loss",
    difficulty: "medium",
    question: "A product bought for ₹500 is sold for ₹650. Find profit.",
    options: ["100", "150", "200", "250"],
    answer: "150",
    explanation:
      "Profit = Selling Price - Cost Price = 650 - 500 = 150.",
    shortcut:
      "Always subtract CP from SP for profit.",
  },

  {
    id: 3,
    topic: "Ratio",
    difficulty: "easy",
    question: "Find ratio of 20 and 50.",
    options: ["2:5", "5:2", "1:2", "3:5"],
    answer: "2:5",
    explanation:
      "20:50 simplifies by dividing both by 10 → 2:5.",
    shortcut:
      "Simplify ratios using highest common factor.",
  },

  {
    id: 4,
    topic: "Time & Work",
    difficulty: "hard",
    question: "If A completes work in 10 days, how much work in 1 day?",
    options: ["1/5", "1/10", "10", "5"],
    answer: "1/10",
    explanation:
      "Work done in 1 day = 1 / total days.",
    shortcut:
      "For work problems, use unit work approach.",
  },

  {
    id: 5,
    topic: "Probability",
    difficulty: "medium",
    question: "Probability of getting head in one coin toss?",
    options: ["0", "1", "1/2", "2"],
    answer: "1/2",
    explanation:
      "One favorable outcome out of 2 total outcomes.",
    shortcut:
      "Probability = favorable / total outcomes.",
  },
];