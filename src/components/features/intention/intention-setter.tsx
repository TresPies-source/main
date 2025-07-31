
'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sunrise, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setIntention as setIntentionAction } from './intention-actions';
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
      <capsuleGeometry args={[0.8, 1, 4, 8]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
}

export function IntentionSetter() {
  const { user } = useAuth();
  const [intention, setIntention] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousIntentions, setPreviousIntentions] = useState<string[]>([]);
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
      setPreviousIntentions([]);
      return;
    }

    const q = query(
        collection(db, 'intentions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const intentions = querySnapshot.docs.map(doc => doc.data().intention as string);
        setPreviousIntentions(intentions);
    });
    
    return () => unsubscribe();
  }, [user]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: 'Not signed in', description: 'You must be signed in to set an intention.', variant: 'destructive' });
        return;
    }
    if (!intention.trim()) {
      toast({
        title: 'No intention set',
        description: 'Please write down your intention for the day.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResponse('');
    try {
      const result = await setIntentionAction(user.uid, intention, previousIntentions);
      setResponse(result.response);
      setIntention('');
      setPlayAddAnimation(true);

    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="relative h-full w-full max-w-4xl mx-auto">
        <div className="absolute inset-0 z-10 grid gap-8 p-4">
            <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Sunrise className="text-accent" />
                    What is your intention for today?
                </CardTitle>
                <CardDescription>
                    Set a clear goal or focus for your day. The AI will give you a little boost, remembering your past goals to cheer you on.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                    placeholder="e.g., To be present in every conversation, to complete my most important task, to drink more water..."
                    value={intention}
                    onChange={e => setIntention(e.target.value)}
                    className="min-h-[100px]"
                    disabled={!user || isLoading}
                    />
                    <Button type="submit" className="w-full" disabled={!user || isLoading}>
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        'Set My Intention'
                    )}
                    </Button>
                </form>
                </CardContent>
            </Card>

            {(isLoading || response) && (
                <Card className="bg-secondary/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline text-base flex items-center gap-2">
                        <Sparkles className="text-accent" />
                        Your Daily Boost
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="animate-spin h-4 w-4" />
                            <p>Generating your encouragement...</p>
                        </div>
                    )}
                    {response && <p className="text-lg italic">{response}</p>}
                </CardContent>
                </Card>
            )}
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
