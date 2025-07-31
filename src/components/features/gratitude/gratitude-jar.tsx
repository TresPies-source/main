
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

const initialGratitudeEntries: GratitudeEntry[] = [
    { id: 'g1', text: 'A beautiful sunny day', rating: 4, createdAt: { seconds: 1722379964, nanoseconds: 0 } },
    { id: 'g2', text: 'A surprise call from an old friend', rating: 5, createdAt: { seconds: 1722379963, nanoseconds: 0 } },
    { id: 'g3', text: 'The first sip of coffee in the morning', rating: 3, createdAt: { seconds: 1722379962, nanoseconds: 0 } },
    { id: 'g4', text: 'Finishing a challenging task at work', rating: 4, createdAt: { seconds: 1722379961, nanoseconds: 0 } },
    { id: 'g5', text: 'A quiet moment of reflection', rating: 3, createdAt: { seconds: 1722379960, nanoseconds: 0 } },
];

export function GratitudeJar() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<GratitudeEntry[]>(initialGratitudeEntries);
  const [newEntry, setNewEntry] = useState('');
  const [currentRating, setCurrentRating] = useState(3);
  const [insightsState, setInsightsState] = useState<{ loading: boolean; data: AnalyzeGratitudePatternsOutput | null; open: boolean }>({ loading: false, data: null, open: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playAddAnimation, setPlayAddAnimation] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useLayoutEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x8BAA7A });
    const model = new THREE.Mesh(geometry, material);
    scene.add(model);
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const originalColor = new THREE.Color(0x8BAA7A);
    const clickColor = new THREE.Color(0xE5989B);
    
    let animatedObjects: { mesh: THREE.Mesh; progress: number; }[] = [];
    const animationDuration = 0.3;
    const taskAnimationDuration = 1.0;
    let animationState = { isAnimating: false, progress: 0, type: '' };

    if (playAddAnimation) {
      animationState = { isAnimating: true, progress: 0, type: 'addTask' };
      setPlayAddAnimation(false);
    }
    
    const handleMouseDown = (event: MouseEvent) => {
        if (!currentMount) return;
        const rect = currentMount.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        
        if (intersects.length > 0 && intersects[0].object === model) {
            animationState = { isAnimating: true, progress: 0, type: 'click' };
        }
    };
    
    renderer.domElement.addEventListener('mousedown', handleMouseDown);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();

      if (model) {
        model.rotation.y += 0.005;
        model.rotation.x += 0.005;
      }
      
      if (animationState.isAnimating && model) {
        animationState.progress += deltaTime;
        const phase = animationState.progress / animationDuration;
        if (animationState.type === 'click') {
            if (phase < 1) {
                (model.material as THREE.MeshStandardMaterial).color.lerpColors(originalColor, clickColor, Math.sin(phase * Math.PI));
            } else {
                (model.material as THREE.MeshStandardMaterial).color.copy(originalColor);
                animationState.isAnimating = false;
            }
        } else if (animationState.type === 'addTask') {
            const taskGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const taskMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const taskCube = new THREE.Mesh(taskGeometry, taskMaterial);
            taskCube.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, 2);
            scene.add(taskCube);
            animatedObjects.push({ mesh: taskCube, progress: 0 });
            animationState.isAnimating = false; // Reset for next trigger
        }
      }
      
      animatedObjects.forEach((obj, index) => {
        obj.progress += deltaTime / taskAnimationDuration;
        if (obj.progress < 1) {
            obj.mesh.position.lerp(new THREE.Vector3(0, 0, 0), deltaTime * 2);
        } else {
            scene.remove(obj.mesh);
            obj.mesh.geometry.dispose();
            (obj.mesh.material as THREE.Material).dispose();
            animatedObjects.splice(index, 1);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

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

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      scene.clear();
      renderer.dispose();
    };
  }, [playAddAnimation]);

  useEffect(() => {
    if (!user) {
      setEntries(initialGratitudeEntries);
      return;
    }

    const q = query(collection(db, 'gratitude'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty && user) {
        setEntries([]);
        return;
      }
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
    // Only analyze entries created by the user, not the initial sample ones.
    const userEntries = entries.filter(e => initialGratitudeEntries.findIndex(ig => ig.id === e.id) === -1);
    if (userEntries.length < 5) {
        toast({ title: 'Not enough entries', description: 'You need at least 5 of your own gratitude entries for a meaningful analysis.', variant: 'destructive' });
        return;
    }
    setInsightsState({ loading: true, data: null, open: true });
    try {
        const entryTexts = userEntries.map(e => e.text);
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
  
  const canAnalyze = user && entries.filter(e => initialGratitudeEntries.findIndex(ig => ig.id === e.id) === -1).length >= 5;

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

    <div className="w-full h-[300px] bg-background rounded-lg mb-8">
      <div ref={mountRef} className="w-full h-full" />
    </div>

    <div className="grid md:grid-cols-2 gap-8">
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

      <div className="md:col-span-1">
        <Card className="min-h-[400px]">
          <CardHeader>
            <div className='flex justify-between items-start'>
              <div>
                <CardTitle className="font-headline">Your Gratitude Jar</CardTitle>
                <CardDescription>
                  Moments of thankfulness you've collected.
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleAnalyzeGratitude} disabled={!canAnalyze}>
                <Wand2 className="mr-2 h-4 w-4" />
                AI Insights
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {
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
            }
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}

    