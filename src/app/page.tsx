
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from "lucide-react";
import dynamic from 'next/dynamic';
import { startOfToday } from 'date-fns';
import { StreakCard } from '@/components/features/dashboard/streak-card';
import { RecordsCard } from '@/components/features/dashboard/records-card';
import type { FocusSession } from '@/components/features/dashboard/types';

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


// This function calculates the streak based on a set of unique activity dates.
const calculateStreak = (uniqueActivityDays: Set<number>): number => {
    if (uniqueActivityDays.size === 0) {
        return 0;
    }

    const today = startOfToday();
    let mostRecentActivityDate = new Date(0);
    uniqueActivityDays.forEach(dayTimestamp => {
        const d = new Date(dayTimestamp);
        if (d > mostRecentActivityDate) {
            mostRecentActivityDate = d;
        }
    });

    const diffInDays = (d1: Date, d2: Date) => {
        const t2 = d2.getTime();
        const t1 = d1.getTime();
        return Math.floor((t2-t1)/(24*3600*1000));
    }

    // If the most recent activity was before yesterday, streak is broken.
    if (diffInDays(mostRecentActivityDate, today) > 1) {
        return 0;
    }

    let currentStreak = 0;
    let dateToCheck = mostRecentActivityDate;

    // Check backwards from the most recent activity day.
    while (uniqueActivityDays.has(dateToCheck.getTime())) {
        currentStreak++;
        dateToCheck.setDate(dateToCheck.getDate() - 1);
    }
    
    return currentStreak;
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

    const q = query(collection(db, 'focusSessions'), where('userId', '==', user.uid));
    
    // Combined listener for all stats
    const unsub = onSnapshot(q, (focusSnapshot) => {
        const unsubWins = onSnapshot(query(collection(db, 'wins'), where('userId', '==', user.uid)), (winsSnapshot) => {
            // Longest Session Calculation
            const sessions: FocusSession[] = focusSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FocusSession));
            const maxDuration = sessions.reduce((max, s) => Math.max(max, s.duration), 0);
            setLongestSession(maxDuration);
            
            // Total Wins Calculation
            setTotalWins(winsSnapshot.docs.length);

            // Streak Calculation
            const focusDates = focusSnapshot.docs.map(d => startOfToday(d.data().createdAt.toDate()).getTime());
            const winDates = winsSnapshot.docs.map(d => startOfToday(d.data().createdAt.toDate()).getTime());
            const uniqueActivityDays = new Set([...focusDates, ...winDates]);
            setStreak(calculateStreak(uniqueActivityDays));
        });

        return () => unsubWins();
    });

    return () => {
      unsub();
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
