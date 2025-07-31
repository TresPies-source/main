
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";

type StreakCardProps = {
    streak: number | null;
};

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-base">
          <Flame className="text-accent" />
          Daily Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        {streak === null ? (
          <Skeleton className="h-10 w-1/2" />
        ) : (
          <>
            <p className="text-4xl font-bold">{streak} <span className="text-lg font-normal text-muted-foreground">days</span></p>
            <p className="text-sm text-muted-foreground mt-1">
              {streak > 0 ? "Keep up the great work!" : "Start a session or log a win to build a streak!"}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
