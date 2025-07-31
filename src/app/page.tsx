
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const FocusTimer = dynamic(() => import('@/components/features/dashboard/focus-timer').then(mod => mod.FocusTimer), {
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
  const [focusDates, setFocusDates] = useState<number[]>([]);
  const [winDates, setWinDates] = useState<number[]>([]);

  useEffect(() => {
    if (!user) {
      setStreak(0);
      setLongestSession(0);
      setTotalWins(0);
      return;
    }

    // Listener for focus sessions
    const focusQuery = query(collection(db, 'focusSessions'), where('userId', '==', user.uid));
    const unsubFocus = onSnapshot(focusQuery, (snapshot) => {
        const sessions: FocusSession[] = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FocusSession));
        const maxDuration = sessions.reduce((max, s) => Math.max(max, s.duration), 0);
        setLongestSession(maxDuration);
        
        const dates = snapshot.docs.map(d => startOfToday(d.data().createdAt.toDate()).getTime());
        setFocusDates(dates);
    });

    // Listener for wins
    const winsQuery = query(collection(db, 'wins'), where('userId', '==', user.uid));
    const unsubWins = onSnapshot(winsQuery, (snapshot) => {
        setTotalWins(snapshot.docs.length);
        const dates = snapshot.docs.map(d => startOfToday(d.data().createdAt.toDate()).getTime());
        setWinDates(dates);
    });

    return () => {
      unsubFocus();
      unsubWins();
    };
  }, [user]);

  // Calculate streak whenever dates change
  useEffect(() => {
    const uniqueActivityDays = new Set([...focusDates, ...winDates]);
    setStreak(calculateStreak(uniqueActivityDays));
  }, [focusDates, winDates]);


  return (
    <MainLayout title="Growth Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FocusTimer />
        
        <div className="space-y-6 lg:col-start-3">
          <StreakCard streak={streak} />
          <RecordsCard longestSession={longestSession} totalWins={totalWins} />
        </div>

        <div className="lg:col-span-3">
            <GrowthInsights />
        </div>

         <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle asChild>
                  <h2 className="font-headline flex items-center gap-2"><Trophy className="text-accent"/> Log Your Accomplishments</h2>
                </CardTitle>
                <CardDescription>
                    Visit the Win Jar to log your daily accomplishments and build momentum.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/wins">Go to Win Jar</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
