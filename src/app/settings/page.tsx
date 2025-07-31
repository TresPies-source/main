'use client';

import MainLayout from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Info, Power, PowerOff, Compass, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

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

function DataManagementCard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);

    try {
        const idToken = await user.getIdToken(true);
        const response = await fetch('/api/delete-user', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete account.');
        }

        toast({
            title: 'Account Deleted',
            description: 'Your account and all associated data have been successfully deleted.',
        });
        
        // This will clear the user from the auth context and redirect.
        await signOut();

    } catch (error: any) {
        console.error('Error deleting account:', error);
        toast({
            title: 'Deletion Error',
            description: error.message,
            variant: 'destructive',
        });
    } finally {
        setIsDeleting(false);
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>Export or permanently delete your account data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" disabled>Export All Data</Button>
      </CardContent>
      <CardFooter className="border-t pt-6 bg-destructive/10">
        <div className="flex justify-between items-center w-full">
            <div>
                <h3 className="font-semibold text-destructive">Delete Account</h3>
                <p className="text-sm text-destructive/80">Permanently delete your account and all data. This action cannot be undone.</p>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={!user || isDeleting}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4"/>}
                        Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Yes, delete my account</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardFooter>
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
        <DataManagementCard />
      </div>
    </MainLayout>
  );
}
