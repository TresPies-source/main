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
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Info, Power, PowerOff, Compass, Trash2, Loader2, Download, Zap } from "lucide-react";
import { useState } from "react";
import { exportToDrive } from "@/ai/flows/export-to-drive";
import { Badge } from "@/components/ui/badge";

function AccountCard() {
    const { user, loading } = useAuth();
    return (
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>View your account details.</CardDescription>
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

function SubscriptionCard() {
    const { user, isPro } = useAuth();
    const { toast } = useToast();

    const handleUpgrade = () => {
        // This is where you would trigger your payment provider's checkout flow.
        // e.g., `stripe.redirectToCheckout(...)`
        toast({
            title: "Redirecting to checkout...",
            description: "This is a placeholder. A real payment provider would be integrated here."
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your ZenJar Pro subscription.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold">Your Plan</h3>
                        <Badge variant={isPro ? "default" : "secondary"}>{isPro ? 'ZenJar Pro' : 'Free Tier'}</Badge>
                    </div>
                    {isPro ? (
                        <Button variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "Subscription management portal is not yet implemented."})}>Manage Subscription</Button>
                    ) : (
                        <Button onClick={handleUpgrade} disabled={!user}>
                            <Zap className="mr-2 h-4 w-4" />
                            Upgrade to Pro
                        </Button>
                    )}
                </div>
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
  const { user, signOut, googleAccessToken, connectGoogle } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleAuthForApi = async () => {
    let token = googleAccessToken;
    if (!token) {
        token = await connectGoogle();
    }
    if (!token) {
        toast({ title: 'Authentication Failed', description: 'Could not get Google access token. Please try connecting your account again.', variant: 'destructive' });
        return null;
    }
    return token;
  }

  const handleExportData = async () => {
    if (!user) return;
    setIsExporting(true);

    const token = await handleAuthForApi();
    if(!token) {
        setIsExporting(false);
        return;
    }

    try {
        // 1. Fetch all data from all collections
        const collections = ['tasks', 'wins', 'focusSessions', 'gratitude', 'intentions', 'affirmations'];
        const userData: { [key: string]: any[] } = {};

        for (const collectionName of collections) {
            const q = query(collection(db, collectionName), where('userId', '==', user.uid));
            const snapshot = await getDocs(q);
            userData[collectionName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        // 2. Call the export flow
        const result = await exportToDrive({ accessToken: token, userData });

        if (result.success) {
            toast({
                title: "Export Successful",
                description: result.message,
                action: (
                    <a href={result.fileLink} target="_blank" rel="noopener noreferrer">
                       <Button variant="outline">View File</Button>
                    </a>
                )
            });
        } else {
            throw new Error(result.message);
        }

    } catch (error: any) {
         console.error('Error exporting data:', error);
        toast({
            title: 'Export Error',
            description: error.message || "An unknown error occurred during export.",
            variant: 'destructive',
        });
    } finally {
        setIsExporting(false);
    }
  }


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
        <Button variant="outline" onClick={handleExportData} disabled={!user || isExporting}>
          {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
          Export All Data to Google Drive
        </Button>
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
        <SubscriptionCard />
        <IntegrationsCard />
        <Card>
            <CardHeader>
                <CardTitle>About ZenJar</CardTitle>
                <CardDescription>Learn more about our mission and what's next.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline">
                    <Link href="/public/about">
                        <Info className="mr-2 h-4 w-4" />
                        Our Philosophy
                    </Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href="/public/roadmap">
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
