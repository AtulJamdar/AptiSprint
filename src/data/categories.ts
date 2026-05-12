/**
 * Category definitions for AptiPrep
 * PHASE 1: Core quantitative reasoning topics
 * Organized by frequency in placement tests
 */

export type CategoryName =
  | "Percentages"
  | "Profit & Loss"
  | "Ratio & Proportion"
  | "Time & Work"
  | "Time, Speed & Distance"
  | "Simple Interest"
  | "Compound Interest"
  | "Average"
  | "Ages"
  | "Probability"
  | "Number Series"
  | "Permutation & Combination"
  | "Data Interpretation";

export interface Category {
  name: CategoryName;
  description: string;
  phase: 1 | 2;
  difficulty: "beginner" | "intermediate" | "advanced";
}

/**
 * PHASE 1: Core Quantitative Topics (MVP coverage)
 * These are the essential categories that placement exams heavily test
 */
export const categories: Category[] = [
  {
    name: "Percentages",
    description: "Percentage calculations, discounts, profit margins",
    phase: 1,
    difficulty: "beginner",
  },
  {
    name: "Profit & Loss",
    description: "Cost price, selling price, profit/loss calculations",
    phase: 1,
    difficulty: "beginner",
  },
  {
    name: "Ratio & Proportion",
    description: "Ratios, proportions, comparisons, and scaling",
    phase: 1,
    difficulty: "beginner",
  },
  {
    name: "Time & Work",
    description: "Work rates, collaboration, and time management",
    phase: 1,
    difficulty: "intermediate",
  },
  {
    name: "Time, Speed & Distance",
    description: "Speed, distance, time calculations, relative motion",
    phase: 1,
    difficulty: "intermediate",
  },
  {
    name: "Simple Interest",
    description: "SI calculations, principals, and rates",
    phase: 1,
    difficulty: "intermediate",
  },
  {
    name: "Compound Interest",
    description: "CI calculations, compound growth, and rates",
    phase: 1,
    difficulty: "intermediate",
  },
  {
    name: "Average",
    description: "Mean, median, mode, weighted averages",
    phase: 1,
    difficulty: "intermediate",
  },
  {
    name: "Ages",
    description: "Age-related problems and ratio of ages",
    phase: 1,
    difficulty: "intermediate",
  },
  {
    name: "Probability",
    description: "Basic probability, independent events, combinations",
    phase: 1,
    difficulty: "advanced",
  },
  {
    name: "Number Series",
    description: "Number patterns, sequences, and progressions",
    phase: 1,
    difficulty: "advanced",
  },
  {
    name: "Permutation & Combination",
    description: "Arrangements, selections, and counting principles",
    phase: 1,
    difficulty: "advanced",
  },
  {
    name: "Data Interpretation",
    description: "Charts, graphs, and data analysis",
    phase: 1,
    difficulty: "advanced",
  },
];

/**
 * Future PHASE 2 topics (not implemented yet)
 * These will be added after PHASE 1 is solid:
 * - Boats & Streams
 * - Pipes & Cisterns
 * - Mixtures & Allegations
 * - Partnership
 * - Clocks
 * - Calendars
 * - Logarithms
 * - Geometry
 * - Mensuration
 */

export const getCategoryByName = (name: string): Category | undefined => {
  return categories.find((cat) => cat.name === name);
};

export const getPhase1Categories = (): Category[] => {
  return categories.filter((cat) => cat.phase === 1);
};

export const getCategoriesByDifficulty = (
  difficulty: "beginner" | "intermediate" | "advanced"
): Category[] => {
  return categories.filter((cat) => cat.difficulty === difficulty);
};
