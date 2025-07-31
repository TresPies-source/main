'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RefreshCw, Sparkles, Plus, Trash2, Wand2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
  orderBy
} from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const defaultQuotes = [
  "The secret of getting ahead is getting started.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you’ve ever wanted is on the other side of fear.",
  "The journey of a thousand miles begins with a single step.",
  "What you get by achieving your goals is not as important as what you become by achieving your goals.",
  "The future belongs to those who believe in the beauty of their dreams."
];

type Affirmation = {
  id: string;
  text: string;
  createdAt: Timestamp;
};

export function MotivationJar() {
  const { user } = useAuth();
  // Assume pro user for demonstration
  const isProUser = true; 
  const [currentQuote, setCurrentQuote] = useState('');
  const [customAffirmations, setCustomAffirmations] = useState<Affirmation[]>([]);
  const [newAffirmation, setNewAffirmation] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setCustomAffirmations([]);
      return;
    }
    const q = query(collection(db, 'affirmations'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const userAffirmations: Affirmation[] = [];
        snapshot.forEach(doc => {
            userAffirmations.push({ ...doc.data(), id: doc.id } as Affirmation);
        });
        setCustomAffirmations(userAffirmations);
    });
    return () => unsubscribe();
  }, [user]);

  const drawQuote = () => {
    const allQuotes = [...defaultQuotes, ...customAffirmations.map(a => a.text)];
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    setCurrentQuote(allQuotes[randomIndex]);
  };
  
  useEffect(() => {
    drawQuote();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customAffirmations]);

  const handleAddAffirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Not signed in", variant: "destructive"});
        return;
    }
    if (!isProUser) {
        toast({ title: "Upgrade to Pro", description: "Add your own affirmations with ZenJar Pro."});
        return;
    }
    if (newAffirmation.trim()) {
        await addDoc(collection(db, 'affirmations'), {
            text: newAffirmation,
            userId: user.uid,
            createdAt: Timestamp.now(),
        });
        setNewAffirmation('');
        toast({ title: "Affirmation added!"});
    }
  }

  const handleDeleteAffirmation = async (id: string) => {
    await deleteDoc(doc(db, 'affirmations', id));
    toast({ title: 'Affirmation removed.' });
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
        <Card className="text-center shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline flex items-center justify-center gap-2">
            <Sparkles className="text-accent" /> A Dose of Motivation
            </CardTitle>
            <CardDescription>Click the button for a burst of inspiration from your collection.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
            <div className="min-h-[100px] flex items-center justify-center p-4">
                {currentQuote ? (
                    <blockquote className="text-xl italic font-medium text-center">
                    "{currentQuote}"
                    </blockquote>
                ) : (
                    <div className="h-8 w-3/4 animate-pulse bg-muted rounded-md" />
                )}
            </div>
            <Button onClick={drawQuote} size="lg">
            <RefreshCw className="mr-2 h-4 w-4" /> Draw Another
            </Button>
        </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Wand2 className="text-accent" /> Your Custom Affirmations (Pro)
                </CardTitle>
                <CardDescription>
                    Add your own personal quotes, mantras, and affirmations to the jar.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleAddAffirmation} className="flex gap-2">
                    <Input 
                        placeholder="e.g., I am capable and strong."
                        value={newAffirmation}
                        onChange={(e) => setNewAffirmation(e.target.value)}
                        disabled={!user || !isProUser}
                    />
                    <Button type="submit" size="icon" aria-label="Add Affirmation" disabled={!user || !isProUser}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </form>
                <Separator className="my-4" />
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {user ? (
                        customAffirmations.length > 0 ? (
                            customAffirmations.map(affirmation => (
                                <div key={affirmation.id} className="group flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                                    <p className="text-sm">{affirmation.text}</p>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteAffirmation(affirmation.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                Your custom affirmations will appear here.
                            </p>
                        )

                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            Sign in to manage your affirmations.
                        </p>
                    )}
                </div>
            </CardContent>
             {!isProUser && (
                <CardFooter>
                    <Button className="w-full" disabled>Upgrade to Pro to Add Affirmations</Button>
                </CardFooter>
             )}
        </Card>
    </div>
  );
}
