'use client';

import { useState, useEffect } from 'react';

export interface UseCountdownOptions {
  initialSeconds: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export function useCountdown({
  initialSeconds,
  onExpire,
  autoStart = true
}: UseCountdownOptions) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          if (onExpire) {
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onExpire]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (newSeconds?: number) => {
    setSecondsLeft(newSeconds !== undefined ? newSeconds : initialSeconds);
    setIsRunning(true);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 300 && secondsLeft > 0;

  return {
    secondsLeft,
    minutes,
    seconds,
    formatted: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    isUrgent,
    isExpired: secondsLeft <= 0,
    isRunning,
    start,
    pause,
    reset
  };
}
