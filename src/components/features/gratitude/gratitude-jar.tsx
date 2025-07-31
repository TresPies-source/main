'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Plus, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type GratitudeEntry = {
  id: string;
  text: string;
  rating: number;
  createdAt: Timestamp;
};

const ratingDescriptions: { [key: number]: string } = {
    1: 'A little thankful',
    2: 'Quite thankful',
    3: 'Very thankful',
    4: 'Extremely thankful',
    5: 'Overflowing with gratitude'
};

export function GratitudeJar() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [currentRating, setCurrentRating] = useState(3);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const q = query(collection(db, 'gratitude'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedEntries: GratitudeEntry[] = [];
      querySnapshot.forEach((doc) => {
        fetchedEntries.push({ ...doc.data(), id: doc.id } as GratitudeEntry);
      });
      setEntries(fetchedEntries.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: 'Not signed in', description: 'You must be signed in to add to your jar.', variant: 'destructive' });
        return;
    }
    if (!newEntry.trim()) {
      toast({
        title: 'Empty entry',
        description: 'Please write what you are grateful for.',
        variant: 'destructive',
      });
      return;
    }

    await addDoc(collection(db, 'gratitude'), {
      text: newEntry,
      rating: currentRating,
      userId: user.uid,
      createdAt: Timestamp.now(),
    });

    setNewEntry('');
    setCurrentRating(3);
    toast({
        title: 'Gratitude Added',
        description: 'Your moment has been saved in the jar.',
    })
  };

  const getFontSizeClass = (rating: number) => {
    switch (rating) {
      case 1: return 'text-sm';
      case 2: return 'text-base';
      case 3: return 'text-lg';
      case 4: return 'text-xl';
      case 5: return 'text-2xl font-bold';
      default: return 'text-base';
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Plus className="text-accent" /> Add Gratitude
            </CardTitle>
            <CardDescription>
              What are you thankful for right now?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="e.g., A warm cup of coffee, a call from a friend..."
                value={newEntry}
                onChange={e => setNewEntry(e.target.value)}
                className="min-h-[100px]"
                disabled={!user}
              />
              <div>
                <label className="text-sm font-medium mb-2 block">How grateful do you feel?</label>
                <TooltipProvider>
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4, 5].map(rating => (
                            <Tooltip key={rating}>
                                <TooltipTrigger asChild>
                                    <Heart
                                        key={rating}
                                        className={`cursor-pointer transition-all ${currentRating >= rating ? 'text-red-500 fill-current' : 'text-muted-foreground'}`}
                                        onClick={() => setCurrentRating(rating)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{ratingDescriptions[rating]}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
              </div>
              <Button type="submit" className="w-full" disabled={!user}>
                Add to Jar
              </Button>
            </form>
            {!user && <p className="text-xs text-center text-muted-foreground mt-4">Please sign in to save your entries.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="min-h-[400px]">
          <CardHeader>
            <div className='flex justify-between items-start'>
                <div>
                    <CardTitle className="font-headline">Your Gratitude Jar</CardTitle>
                    <CardDescription>
                    Moments of thankfulness you've collected.
                    </CardDescription>
                </div>
                <Button variant="outline" disabled>
                    <Wand2 className="mr-2 h-4 w-4" />
                    AI Insights (Pro)
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            {user ? (
                entries.length > 0 ? (
                    <div className="space-y-2">
                        {entries.map(entry => (
                            <div key={entry.id} className="p-3 bg-secondary/50 rounded-lg">
                                <p className={`${getFontSizeClass(entry.rating)} transition-all`}>
                                    {entry.text}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                  <div className="text-center text-muted-foreground pt-20">
                    <p>Your gratitude jar is empty.</p>
                    <p className="text-sm">Add something you're thankful for to start.</p>
                  </div>
                )
            ) : (
                <div className="text-center text-muted-foreground pt-20">
                    <p>Please sign in to see your gratitude jar.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
