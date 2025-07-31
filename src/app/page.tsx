'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, Trophy, TrendingUp } from "lucide-react";
import dynamic from 'next/dynamic';

const FocusTimer = dynamic(() => import('@/components/features/dashboard/focus-timer').then(mod => mod.FocusTimer), {
  ssr: false,
  loading: () => <Skeleton className="h-[250px] w-full" />,
});
const WinJar = dynamic(() => import('@/components/features/dashboard/win-jar').then(mod => mod.WinJar), {
  ssr: false,
  loading: () => <Skeleton className="h-[250px] w-full" />,
});
const GrowthInsights = dynamic(() => import('@/components/features/dashboard/growth-insights').then(mod => mod.GrowthInsights), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});


type FocusSession = {
  id: string;
  duration: number;
  createdAt: Timestamp;
};

type Win = {
  id: string;
  text: string;
  createdAt: Timestamp;
};

function StreakCard({ streak }: { streak: number | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-base">
          <Flame className="text-accent"/>
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

function RecordsCard({ longestSession, totalWins }: { longestSession: number | null, totalWins: number | null }) {
    const formatDuration = (seconds: number) => {
        if (seconds === 0) return 'N/A';
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-base">
              <TrendingUp className="text-accent"/>
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
};


export default function DashboardPage() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<number | null>(null);
  const [longestSession, setLongestSession] = useState<number | null>(null);
  const [totalWins, setTotalWins] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setStreak(0);
      setLongestSession(0);
      setTotalWins(0);
      return;
    }

    const focusQuery = query(collection(db, 'focusSessions'), where('userId', '==', user.uid));
    const winsQuery = query(collection(db, 'wins'), where('userId', '==', user.uid));

    const unsubFocus = onSnapshot(focusQuery, (snapshot) => {
      const sessions: FocusSession[] = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FocusSession));
      const maxDuration = sessions.reduce((max, s) => Math.max(max, s.duration), 0);
      setLongestSession(maxDuration);
    });

    const unsubWins = onSnapshot(winsQuery, (snapshot) => {
        setTotalWins(snapshot.docs.length);
    });

    const unsubStreak = onSnapshot(
        query(collection(db, 'focusSessions'), where('userId', '==', user.uid)),
        (focusSnapshot) => {
            const unsubInner = onSnapshot(
                query(collection(db, 'wins'), where('userId', '==', user.uid)),
                (winsSnapshot) => {
                    const focusDates = focusSnapshot.docs.map(d => d.data().createdAt.toDate());
                    const winDates = winsSnapshot.docs.map(d => d.data().createdAt.toDate());

                    const activityDates = [...focusDates, ...winDates].map(d => {
                        const date = new Date(d);
                        date.setHours(0, 0, 0, 0);
                        return date.getTime();
                    });
                    const uniqueActivityDays = new Set(activityDates);

                    if (uniqueActivityDays.size === 0) {
                        setStreak(0);
                        return;
                    }

                    let currentStreak = 0;
                    let dateToCheck = new Date();
                    dateToCheck.setHours(0, 0, 0, 0);

                    // Check for today's activity
                    if (uniqueActivityDays.has(dateToCheck.getTime())) {
                        currentStreak++;
                        dateToCheck.setDate(dateToCheck.getDate() - 1);
                    } else {
                        // If no activity today, check if yesterday was the last activity
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        yesterday.setHours(0,0,0,0);
                        if (!uniqueActivityDays.has(yesterday.getTime())) {
                             // check if today is in the set
                            if(!uniqueActivityDays.has(new Date().setHours(0,0,0,0))) {
                               // there was no activity today or yesterday, so streak is 0
                               // unless today is the day of the last activity
                               const mostRecentActivity = Math.max(...Array.from(uniqueActivityDays));
                               const today = new Date();
                               today.setHours(0,0,0,0);
                               if(mostRecentActivity < today.getTime()){
                                   setStreak(0);
                                   return;
                               }
                            }
                        }
                    }

                    // Check for consecutive days backwards
                    while (uniqueActivityDays.has(dateToCheck.getTime())) {
                        currentStreak++;
                        dateToCheck.setDate(dateToCheck.getDate() - 1);
                    }
                    
                    setStreak(currentStreak);
                }
            );
            return () => unsubInner();
        }
    );

    return () => {
      unsubFocus();
      unsubWins();
      unsubStreak();
    };
  }, [user]);

  return (
    <MainLayout title="Growth Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Trophy className="text-accent"/>
              Focus & Win
            </CardTitle>
            <CardDescription>
              Start a focus session or log a new win. Your journey to growth starts here.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FocusTimer />
            <WinJar />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <StreakCard streak={streak} />
          <RecordsCard longestSession={longestSession} totalWins={totalWins} />
        </div>

        <div className="lg:col-span-3">
            <GrowthInsights />
        </div>
      </div>
    </MainLayout>
  );
}
