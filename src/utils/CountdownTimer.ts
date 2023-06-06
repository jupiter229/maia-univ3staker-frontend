import { useEffect, useState } from "react";

const calculateSecondsLeft = (targetDate: number) => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const remainingTime = Math.max(0, targetDate - currentTime); // Calculate remaining time

  return remainingTime;
};

export const useCountdownTimer = (targetDate: Date) => {
  const countDownDate = targetDate.getTime();

  const [secondsLeft, setSecondsLeft] = useState(
    calculateSecondsLeft(countDownDate)
  );

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft(calculateSecondsLeft(countDownDate));
    }, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [secondsLeft, countDownDate]);

  return secondsLeft;
};

interface IProps {
  targetDate: number;
}
