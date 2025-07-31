
'use client';

import { useState, useEffect, Suspense, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Sparkles, Plus, Trash2, Wand2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { addCustomAffirmation, deleteCustomAffirmation } from './motivation-actions';

const defaultQuotes = [
  "You don’t always get what you wish for; you get what you work for.",
  "Believe you can, and you’re already halfway there.",
  "Expect things of yourself before you can do them.",
  "Progress, not perfection.",
  "A small step today leads to a big leap tomorrow.",
  "Done is better than perfect.",
  "If not now, when?",
  "Your future self will thank you for starting today.",
  "Motivation follows action—just begin.",
  "One minute of work leads to many more.",
  "Break it down and build it up.",
  "You have the power in this moment.",
  "Consistency beats intensity over time.",
  "Stop thinking. Start doing.",
  "Every task completed is a win.",
  "You’re closer than you were yesterday.",
  "Actions create momentum.",
  "Focus on the next right step.",
  "Aim for progress, not excuses.",
  "The journey of a thousand miles begins with a single click.",
  "The difference between the ordinary and the extraordinary is that little extra.",
  "The pain you feel today is the strength you will feel tomorrow.",
  "For every challenge encountered, there is an opportunity for growth.",
  "The secret of success is to do the common things uncommonly well.",
  "There are no shortcuts to any place worth going.",
  "The harder you work for something, the greater you'll feel when you finally achieve it.",
  "Life has two rules. Never quit, and always remember rule number one.",
  "The fact that you aren't where you want to be should be enough motivation.",
  "It always seems impossible until it's done.",
  "I don't regret the things I've done, I regret the things I didn't do when I had a chance.",
  "Excuses don't get results.",
  "There are no traffic jams on the extra mile.",
  "If it's important to you, you'll find a way. If not, you'll find an excuse.",
  "It’s not going to be easy, but it’s going to be worth it.",
  "You don’t drown by falling in the water; you drown by staying there.",
  "Challenges are what make life interesting. Overcoming them is what makes life meaningful.",
  "There’s no substitute for hard work.",
  "I find that the harder I work, the more luck I seem to have.",
  "The expert in everything was once a beginner.",
  "If you’re going through hell, keep going.",
  "Some people dream of accomplishing great things. Others stay awake and make it happen.",
  "It’s not about how bad you want it, it’s about how hard you’re willing to work for it.",
  "The difference between a stumbling block and a stepping stone is how high you raise your foot.",
  "You don’t have to be great to start, but you have to start to be great.",
  "Never do tomorrow what you can do today.",
  "Procrastination is the thief of time.",
  "Push yourself because no one else is going to do it for you.",
  "Strive for progress, not perfection.",
  "Don’t let what you cannot do interfere with what you can do.",
  "The secret to getting ahead is getting started.",
  "Failure is the opportunity to begin again more intelligently.",
  "Success is the sum of small efforts repeated day in and day out."
];

type Affirmation = {
  id: string;
  text: string;
  createdAt: { seconds: number, nanoseconds: number };
};

export function MotivationJar() {
  const { user } = useAuth();
  const [currentQuote, setCurrentQuote] = useState('');
  const [customAffirmations, setCustomAffirmations] = useState<Affirmation[]>([]);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playAddAnimation, setPlayAddAnimation] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const { toast } = useToast();
  const mountRef = useRef<HTMLDivElement>(null);
  const animationState = useRef({ isAnimating: false, progress: 0 });

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

    const loader = new GLTFLoader();
    let model: THREE.Group;
    setIsModelLoading(true);
    
    loader.load(
        '/models/motivation-jar.glb',
        (gltf) => {
            model = gltf.scene;
            scene.add(model);
            setIsModelLoading(false);
        },
        undefined, 
        (error) => {
            console.error('An error happened while loading the model:', error);
            setIsModelLoading(false);
        }
    );

    const animationDuration = 0.3;
    if (playAddAnimation) {
      animationState.current = { isAnimating: true, progress: 0 };
    }

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();

      if (model) {
        model.rotation.y += 0.005;
      }

      if (animationState.current.isAnimating && model) {
        animationState.current.progress += deltaTime;
        const phase = animationState.current.progress / animationDuration;
        if (phase < 1) {
          const scale = 1 + 0.2 * Math.sin(phase * Math.PI);
          model.scale.set(scale, scale, scale);
        } else {
          model.scale.set(1, 1, 1);
          animationState.current.isAnimating = false;
        }
      }
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
      cancelAnimationFrame(animationFrameId);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [playAddAnimation]);

  useEffect(() => {
    if (playAddAnimation) {
        const timer = setTimeout(() => setPlayAddAnimation(false), 500);
        return () => clearTimeout(timer);
    }
  },[playAddAnimation]);

  useEffect(() => {
    if (!user) {
      setCustomAffirmations([]);
      const randomIndex = Math.floor(Math.random() * defaultQuotes.length);
      setCurrentQuote(defaultQuotes[randomIndex]);
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
    if (allQuotes.length === 0) {
        setCurrentQuote("Add an affirmation to get started!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    setCurrentQuote(allQuotes[randomIndex]);
    setPlayAddAnimation(true);
  };
  
  useEffect(() => {
    drawQuote();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAffirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Not signed in", description: "You must be signed in to add affirmations.", variant: "destructive"});
        return;
    }
    if (newAffirmation.trim()) {
        setIsSubmitting(true);
        try {
            await addCustomAffirmation(user.uid, newAffirmation);
            setNewAffirmation('');
            toast({ title: "Affirmation added!"});
        } catch (error) {
            console.error("Error adding affirmation:", error);
            toast({ title: "Error", description: "Could not add affirmation.", variant: "destructive"});
        } finally {
            setIsSubmitting(false);
        }
    }
  }

  const handleDeleteAffirmation = async (id: string) => {
    try {
        await deleteCustomAffirmation(id);
        toast({ title: 'Affirmation removed.' });
    } catch (error) {
        console.error("Error deleting affirmation: ", error);
        toast({ title: "Error", description: "Could not remove affirmation.", variant: "destructive"});
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
        <div ref={mountRef} className="w-full h-[300px] rounded-lg bg-card mb-8 relative flex items-center justify-center">
            {isModelLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        </div>
        <div className="space-y-8 w-full max-w-lg mx-auto">
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
                          "\"{currentQuote}\""
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
                      <Wand2 className="text-accent" /> Your Custom Affirmations
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
                          disabled={!user || isSubmitting}
                      />
                      <Button type="submit" size="icon" aria-label="Add Affirmation" disabled={!user || isSubmitting}>
                          {isSubmitting ? <Loader2 className='animate-spin' /> : <Plus className="h-4 w-4" />}
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
          </Card>
        </div>
    </div>
  );
}
