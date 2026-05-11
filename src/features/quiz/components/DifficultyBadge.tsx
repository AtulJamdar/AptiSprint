import { Difficulty } from "@/types/question";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: "sm" | "md" | "lg";
}

const difficultyConfig = {
  easy: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500",
    label: "Easy",
  },
  medium: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500",
    label: "Medium",
  },
  hard: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500",
    label: "Hard",
  },
};

const sizeConfig = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export function DifficultyBadge({
  difficulty,
  size = "md",
}: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];
  const sizeClasses = sizeConfig[size];

  return (
    <span
      className={`inline-block border rounded-full font-semibold ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}
