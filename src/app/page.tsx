import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FocusTimer } from "@/components/features/dashboard/focus-timer";
import { WinJar } from "@/components/features/dashboard/win-jar";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, TrendingUp } from "lucide-react";

export default function DashboardPage() {
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
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2 text-base">
                <Flame className="text-accent"/>
                Daily Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0 <span className="text-lg font-normal text-muted-foreground">days</span></p>
              <p className="text-sm text-muted-foreground mt-1">Start your first focus session to build a streak!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2 text-base">
                 <TrendingUp className="text-accent"/>
                Personal Records
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center text-sm text-muted-foreground pt-4">
              <p>Your personal bests will appear here as you use the app.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
