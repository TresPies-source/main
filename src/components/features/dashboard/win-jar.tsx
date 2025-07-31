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
} from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Award } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';

type Win = {
  id: string;
  text: string;
  createdAt: Timestamp;
};

export function WinJar() {
  const { user } = useAuth();
  const [wins, setWins] = useState<Win[]>([]);
  const [newWin, setNewWin] = useState('');
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
    if (newWin.trim()) {
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
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Win Jar</CardTitle>
        <CardDescription>Log your accomplishments.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <form onSubmit={handleAddWin} className="flex gap-2">
          <Input 
            placeholder="e.g., Woke up on time" 
            value={newWin}
            onChange={(e) => setNewWin(e.target.value)}
            disabled={!user}
          />
          <Button type="submit" size="icon" aria-label="Add win" disabled={!user}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <ScrollArea className="mt-4 flex-1 h-[120px]">
          <div className="space-y-2 pr-4">
            {user ? (
              wins.length > 0 ? wins.map((win) => (
                <div key={win.id} className="flex items-center gap-3 text-sm p-2 bg-secondary/50 rounded-md">
                  <Award className="h-4 w-4 text-accent flex-shrink-0"/>
                  <span>{win.text}</span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center pt-8">No wins logged yet.</p>
              )
            ) : (
                <p className="text-sm text-muted-foreground text-center pt-8">Sign in to log your wins.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
