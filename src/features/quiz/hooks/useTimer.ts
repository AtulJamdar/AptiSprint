import { useState, useEffect } from "react";

export function useTimer(initialTime: number, onTimeUp: () => void, pause: boolean) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (pause || timeLeft <= 0) {
      if (timeLeft === 0) onTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, pause, onTimeUp]);

  const resetTimer = () => setTimeLeft(initialTime);

  return { timeLeft, resetTimer };
}