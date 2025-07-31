
'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Trophy, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { addWin, deleteWin } from './win-actions';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import type { Mesh } from 'three';


function PlaceholderJar({ playAnimation }: { playAnimation: boolean }) {
  const meshRef = useRef<Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (playAnimation) {
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 20) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
       if (state.clock.elapsedTime > 0.5) {
          meshRef.current.scale.set(1, 1, 1);
       }
    }
  });
  return (
    <mesh ref={meshRef}>
      <coneGeometry args={[1, 2, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

type Win = {
  id: string;
  text: string;
  createdAt: { seconds: number; nanoseconds: number; };
};

export function WinJar() {
  const { user } = useAuth();
  const [wins, setWins] = useState<Win[]>([]);
  const [newWin, setNewWin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playAddAnimation, setPlayAddAnimation] = useState(false);
  const { toast } = useToast();

   useEffect(() => {
    if (playAddAnimation) {
        const timer = setTimeout(() => setPlayAddAnimation(false), 500); // Animation duration
        return () => clearTimeout(timer);
    }
  },[playAddAnimation]);

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
      setIsSubmitting(true);
      try {
        await addWin(user.uid, newWin);
        setNewWin('');
        setPlayAddAnimation(true);
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
    try {
        await deleteWin(id);
        toast({ title: 'Win removed.' });
    } catch (error) {
        console.error("Error deleting win:", error);
        toast({ title: "Error", description: "Could not remove win.", variant: "destructive"});
    }
  }

  return (
    <div className="relative h-full w-full max-w-4xl mx-auto">
        <div className="absolute inset-0 z-10 grid gap-8 p-4">
            <Card className="shadow-lg bg-background/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                    <Trophy className="text-accent" /> Log Your Accomplishments
                    </CardTitle>
                    <CardDescription>
                        A dedicated space for you to quickly record your daily or weekly wins.
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
            </Card>
        </div>
        <Canvas className="absolute inset-0 z-0">
            <Suspense fallback={null}>
                <Stage environment="city" intensity={0.6}>
                    <PlaceholderJar playAnimation={playAddAnimation} />
                </Stage>
            </Suspense>
            <OrbitControls makeDefault autoRotate />
        </Canvas>
    </div>
  );
}
