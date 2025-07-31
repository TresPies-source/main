

'use client';

import { useState, useEffect, Suspense, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
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

export function IntentionSetter() {
  const { user } = useAuth();
  const [intention, setIntention] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousIntentions, setPreviousIntentions] = useState<string[]>([]);
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
    const geometry = new THREE.CapsuleGeometry(0.8, 1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 'skyblue' });
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
    <div className="relative h-full w-full">
        <div ref={mountRef} className="absolute inset-0 z-0" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg space-y-8">
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
        </div>
    </div>
  );
}
