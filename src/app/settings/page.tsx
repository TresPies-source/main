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
import { Info, Power, PowerOff, Compass } from "lucide-react";

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
  const { user, connectGoogle, googleAccessToken } = useAuth();
  const isConnected = !!googleAccessToken;

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
          <Button variant={isConnected ? 'secondary' : 'outline'} onClick={connectGoogle} disabled={!user}>
            {isConnected ? (
              <>
                <PowerOff className="mr-2 h-4 w-4"/>
                Connected
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
                <CardTitle>About ZenJar</CardTitle>
                <CardDescription>Learn more about our mission and what's next.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline">
                    <Link href="/about">
                        <Info className="mr-2 h-4 w-4" />
                        Our Philosophy
                    </Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href="/roadmap">
                        <Compass className="mr-2 h-4 w-4" />
                        Development Roadmap
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
