

'use client';

import { useState, useEffect, Suspense, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Plus, Wand2, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { AnalyzeGratitudePatternsOutput } from '@/ai/flows/analyze-gratitude-patterns';
import { addGratitudeEntry, callAnalyzeGratitudePatterns } from './gratitude-actions';

type GratitudeEntry = {
  id: string;
  text: string;
  rating: number;
  createdAt: { seconds: number; nanoseconds: number; };
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
  const [insightsState, setInsightsState] = useState<{ loading: boolean; data: AnalyzeGratitudePatternsOutput | null; open: boolean }>({ loading: false, data: null, open: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playAddAnimation, setPlayAddAnimation] = useState(false);
  const { toast } = useToast();
  const mountRef = useRef<HTMLDivElement>(null);
  const animationState = useRef({ isAnimating: false, progress: 0 });

  useLayoutEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Placeholder Jar
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({ color: 'hotpink' });
    const jarMesh = new THREE.Mesh(geometry, material);
    scene.add(jarMesh);

    // Animation variables
    const animationDuration = 0.3; // seconds

    if (playAddAnimation) {
      animationState.current = { isAnimating: true, progress: 0 };
    }

    // Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();

      if (animationState.current.isAnimating) {
        animationState.current.progress += deltaTime;
        const phase = animationState.current.progress / animationDuration;

        if (phase < 1) {
          const scale = 1 + 0.2 * Math.sin(phase * Math.PI);
          jarMesh.scale.set(scale, scale, scale);
        } else {
          jarMesh.scale.set(1, 1, 1);
          animationState.current.isAnimating = false;
        }
      }

      jarMesh.rotation.y += 0.005;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
        if(currentMount) {
            const width = currentMount.clientWidth;
            const height = currentMount.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    }
    window.addEventListener('resize', handleResize);


    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [playAddAnimation]);

   useEffect(() => {
    if (playAddAnimation) {
        const timer = setTimeout(() => setPlayAddAnimation(false), 500); // Animation duration
        return () => clearTimeout(timer);
    }
  },[playAddAnimation]);

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
      setEntries(fetchedEntries.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
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

    setIsSubmitting(true);
    try {
        await addGratitudeEntry(user.uid, newEntry, currentRating);

        setNewEntry('');
        setCurrentRating(3);
        setPlayAddAnimation(true);
        toast({
            title: 'Gratitude Added',
            description: 'Your moment has been saved in the jar.',
        });
    } catch (error) {
        console.error("Error adding gratitude:", error);
        toast({ title: "Error", description: "Could not save your gratitude entry. Please try again.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleAnalyzeGratitude = async () => {
    if (!user) {
        toast({ title: 'Not signed in', description: 'Please sign in to analyze your gratitude.', variant: 'destructive' });
        return;
    }
    if (entries.length < 5) {
        toast({ title: 'Not enough entries', description: 'You need at least 5 gratitude entries for a meaningful analysis.', variant: 'destructive' });
        return;
    }
    setInsightsState({ loading: true, data: null, open: true });
    try {
        const entryTexts = entries.map(e => e.text);
        const result = await callAnalyzeGratitudePatterns({ gratitudeEntries: entryTexts });
        setInsightsState({ loading: false, data: result, open: true });
    } catch (error) {
        console.error('Error analyzing gratitude:', error);
        toast({ title: 'AI Error', description: 'Could not analyze your gratitude entries. Please try again.', variant: 'destructive' });
        setInsightsState({ loading: false, data: null, open: false });
    }
  }

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
    <>
    <AlertDialog open={insightsState.open} onOpenChange={(open) => setInsightsState(prev => ({...prev, open}))}>
        <AlertDialogContent>
             <AlertDialogHeader>
                <AlertDialogTitle className="font-headline flex items-center gap-2">
                    <Wand2 /> AI Gratitude Insights
                </AlertDialogTitle>
                <AlertDialogDescription>
                    Here's what the AI has learned from your gratitude entries.
                </AlertDialogDescription>
            </AlertDialogHeader>
            {insightsState.loading ? (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="animate-spin text-accent" />
                </div>
            ) : insightsState.data ? (
                <div className='space-y-4'>
                    <div>
                        <h3 className='font-semibold flex items-center gap-2'><Sparkles className='h-4 w-4 text-accent'/> Recurring Themes</h3>
                        <div className='mt-2 space-y-2'>
                            {insightsState.data.recurringThemes.map((theme, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm p-3 bg-secondary/50 rounded-md">
                                    <BrainCircuit className="h-4 w-4 mt-1 text-accent flex-shrink-0" />
                                    <span className='flex-1'>{theme}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className='font-semibold flex items-center gap-2'><Heart className='h-4 w-4 text-accent'/> Overall Sentiment</h3>
                        <p className='text-sm text-muted-foreground mt-1'>{insightsState.data.overallSentiment}</p>
                    </div>
                </div>
            ) : null}
            <AlertDialogFooter>
                <AlertDialogAction onClick={() => setInsightsState({ loading: false, data: null, open: false })}>Close</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    <div className="flex flex-col h-full w-full">
        <div ref={mountRef} className="w-full h-[300px] rounded-lg bg-card border mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
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
                        disabled={!user || isSubmitting}
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
                    <Button type="submit" className="w-full" disabled={!user || isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Add to Jar'}
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
                        <Button variant="outline" onClick={handleAnalyzeGratitude} disabled={!user || entries.length < 5}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            AI Insights
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {user ? (
                        entries.length > 0 ? (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
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
    </div>
    </>
  );
}
