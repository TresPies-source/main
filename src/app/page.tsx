import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FocusTimer } from "@/components/features/dashboard/focus-timer";
import { WinJar } from "@/components/features/dashboard/win-jar";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <MainLayout title="Growth">
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
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2 text-base">
                <Flame className="text-accent"/>
                Daily Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">5 <span className="text-lg font-normal text-muted-foreground">days</span></p>
              <p className="text-sm text-muted-foreground mt-1">You're on a roll! Keep it up.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2 text-base">
                 <TrendingUp className="text-accent"/>
                Personal Records
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm">Longest Focus Session</p>
                <Badge variant="secondary">45:12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">Most Wins in a Day</p>
                <Badge variant="secondary">7</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
