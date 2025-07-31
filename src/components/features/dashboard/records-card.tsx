
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

type RecordsCardProps = {
    longestSession: number | null;
    totalWins: number | null;
};

const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

export function RecordsCard({ longestSession, totalWins }: RecordsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-base">
          <TrendingUp className="text-accent" />
          Personal Records
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm pt-2">
        {longestSession === null || totalWins === null ? (
          <>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Longest Focus Session:</span>
              <span className="font-bold">{formatDuration(longestSession)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Wins Logged:</span>
              <span className="font-bold">{totalWins}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
