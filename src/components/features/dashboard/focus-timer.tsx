'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from 'lucide-react';

export function FocusTimer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, time]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setTime(0);
  };

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <Card className="text-center flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Focus Timer</CardTitle>
        <CardDescription>Measure your concentration.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1">
        <p className="text-6xl font-bold font-mono tabular-nums tracking-tighter">
          {formatTime(time)}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <Button onClick={handleReset} variant="outline" size="icon" aria-label="Reset timer">
            <Square className="h-5 w-5" />
          </Button>
          <Button onClick={handleStartPause} size="lg" aria-label={isActive ? 'Pause timer' : 'Start timer'}>
            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
