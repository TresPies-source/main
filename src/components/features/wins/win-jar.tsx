
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Trophy, Zap, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import Link from 'next/link';

type Win = {
  id: string;
  text: string;
  createdAt: Timestamp;
};

export function WinJar() {
  const { user, isPro } = useAuth();
  const [wins, setWins] = useState<Win[]>([]);
  const [newWin, setNewWin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setWins([]);
      return;
    }

    const q = query(
      collection(db, 'wins'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedWins: Win[] = [];
      querySnapshot.forEach((doc) => {
        fetchedWins.push({ ...doc.data(), id: doc.id } as Win);
      });
      setWins(fetchedWins);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddWin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Not signed in', description: 'You must be signed in to log a win.', variant: 'destructive' });
      return;
    }
    if (!isPro && wins.length >= 100) {
        toast({ title: "Free Tier Limit Reached", description: "Upgrade to Pro for unlimited wins."});
        return;
    }
    if (newWin.trim()) {
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, 'wins'), {
            text: newWin,
            userId: user.uid,
            createdAt: Timestamp.now(),
        });

        setNewWin('');
        toast({
            title: 'Win Logged!',
            description: 'Another accomplishment in the jar.',
        });
      } catch (error) {
        console.error("Error adding win:", error);
        toast({ title: "Error", description: "Could not save your win. Please try again.", variant: "destructive" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteWin = async (id: string) => {
    await deleteDoc(doc(db, 'wins', id));
    toast({ title: 'Win removed.' });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
            <Trophy className="text-accent" /> Log Your Accomplishments
            </CardTitle>
            <CardDescription>
                A dedicated space for you to quickly record your daily or weekly wins.
                {!isPro && user && <span className="block mt-1">Free wins: {wins.length}/100</span>}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleAddWin} className="space-y-4">
            <Textarea
                placeholder="e.g., Finished the presentation, went for a run, cooked a healthy meal..."
                value={newWin}
                onChange={e => setNewWin(e.target.value)}
                className="min-h-[100px]"
                disabled={!user || isSubmitting}
            />
            <Button type="submit" className="w-full" disabled={!user || isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> Add Win</>}
            </Button>
            </form>
            <ScrollArea className="mt-6 max-h-60">
                <div className="space-y-2 pr-4">
                    {user ? (
                        wins.length > 0 ? wins.map((win) => (
                            <div key={win.id} className="group flex items-center justify-between gap-3 text-sm p-3 bg-secondary/50 rounded-md">
                                <span className='flex-1'>{win.text}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteWin(win.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground text-center py-8">No wins logged yet. Add one above!</p>
                        )
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">Sign in to log your wins.</p>
                    )}
                </div>
            </ScrollArea>
        </CardContent>
         {!isPro && user && wins.length >= 100 && (
                <CardFooter>
                    <Button asChild className="w-full" variant="outline">
                        <Link href="/settings">
                            <Zap className="mr-2 h-4 w-4" />
                            Upgrade for Unlimited Wins
                        </Link>
                    </Button>
                </CardFooter>
             )}
        </Card>
    </div>
  );
}
