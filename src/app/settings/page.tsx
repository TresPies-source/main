'use client';

import MainLayout from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Info, Link as LinkIcon, Power, PowerOff } from "lucide-react";

function AccountCard() {
    const { user, loading } = useAuth();
    return (
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {loading ? (
                <>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                </>
             ) : user ? (
                <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
             ) : (
                <p>You are not signed in.</p>
             )}
          </CardContent>
        </Card>
    );
}

function IntegrationsCard() {
  // Mock connection status
  const isConnected = false; 

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Connect ZenJar with your other productivity tools.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">Google Suite</h3>
            <p className="text-sm text-muted-foreground">Sync with Calendar, Tasks, Keep, and Drive.</p>
          </div>
          <Button variant={isConnected ? 'destructive' : 'outline'}>
            {isConnected ? (
              <>
                <PowerOff className="mr-2 h-4 w-4"/>
                Disconnect
              </>
            ) : (
              <>
                 <Power className="mr-2 h-4 w-4"/>
                Connect
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


export default function SettingsPage() {
  return (
    <MainLayout title="Settings">
      <div className="space-y-6 max-w-3xl">
        <AccountCard />
        <IntegrationsCard />
        <Card>
            <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>Learn more about ZenJar's mission and what's next.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild variant="outline">
                    <Link href="/public/about">
                        <Info className="mr-2 h-4 w-4" />
                        About ZenJar & Our Roadmap
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
