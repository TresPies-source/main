
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { TrendingUp, Lock } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type FocusSession = {
  duration: number;
  createdAt: Timestamp;
};

type ChartData = {
  date: string;
  focusMinutes: number;
};

export function GrowthInsights() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setChartData([]);
      return;
    }

    const sevenDaysAgo = subDays(startOfDay(new Date()), 6);
    const q = query(
      collection(db, 'focusSessions'),
      where('userId', '==', user.uid),
      where('createdAt', '>=', Timestamp.fromDate(sevenDaysAgo))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions: FocusSession[] = snapshot.docs.map(doc => doc.data() as FocusSession);

      const dataByDay: { [key: string]: number } = {};
      
      // Initialize the last 7 days with 0 minutes
      for (let i = 0; i < 7; i++) {
        const date = format(subDays(new Date(), i), 'MMM d');
        dataByDay[date] = 0;
      }

      sessions.forEach(session => {
        const dateStr = format(session.createdAt.toDate(), 'MMM d');
        const minutes = Math.floor(session.duration / 60);
        if (dataByDay[dateStr] !== undefined) {
          dataByDay[dateStr] += minutes;
        }
      });
      
      const formattedData = Object.keys(dataByDay)
        .map(date => ({
          date,
          focusMinutes: dataByDay[date],
        }))
        .reverse(); // Reverse to have the most recent date last

      setChartData(formattedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);
  
  const chartConfig = {
    focusMinutes: {
      label: 'Focus (minutes)',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <TrendingUp className="text-accent"/>
            Growth Insights
        </CardTitle>
        <CardDescription>
          Visualize your focus trends over the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {loading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className={`h-[250px] w-full ${!user ? 'blur-md' : ''}`}>
            <BarChart data={chartData ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="focusMinutes" fill="var(--color-focusMinutes)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
        {!user && !loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/80">
                <div className="text-center">
                    <p className="font-bold text-lg">Sign In to See Your Insights</p>
                    <p className="text-muted-foreground">Your focus trends and patterns will appear here once you sign in.</p>
                </div>
                <Button disabled>
                    <Lock className="mr-2" /> Sign In to View
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
