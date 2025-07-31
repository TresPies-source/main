
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
  const animationState = useRef({ isAnimating: false, progress: 0, type: '' });
  const modelRef = useRef<THREE.Mesh | null>(null);

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

    const geometry = new THREE.CapsuleGeometry(1, 1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x8BAA7A });
    const model = new THREE.Mesh(geometry, material);
    modelRef.current = model;
    scene.add(model);
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const originalColor = new THREE.Color(0x8BAA7A);
    const clickColor = new THREE.Color(0xE5989B);

    const animationDuration = 0.3;
    if (playAddAnimation) {
      animationState.current = { isAnimating: true, progress: 0, type: 'pop' };
      setPlayAddAnimation(false);
    }
    
    const handleMouseDown = (event: MouseEvent) => {
        if (!currentMount) return;
        const rect = currentMount.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children);
        
        if (intersects.length > 0 && intersects[0].object === modelRef.current) {
            animationState.current = { isAnimating: true, progress: 0, type: 'click' };
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
      
      if (animationState.current.isAnimating && model) {
        animationState.current.progress += deltaTime;
        const phase = animationState.current.progress / animationDuration;
        
        if (animationState.current.type === 'pop') {
            if (phase < 1) {
              const scale = 1 + 0.2 * Math.sin(phase * Math.PI);
              model.scale.set(scale, scale, scale);
            } else {
              model.scale.set(1, 1, 1);
              animationState.current.isAnimating = false;
            }
        } else if (animationState.current.type === 'click') {
            if (phase < 1) {
                (model.material as THREE.MeshStandardMaterial).color.lerpColors(originalColor, clickColor, Math.sin(phase * Math.PI));
            } else {
                (model.material as THREE.MeshStandardMaterial).color.copy(originalColor);
                animationState.current.isAnimating = false;
            }
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
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [playAddAnimation]);

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
    <div className="flex flex-col h-full w-full">
      <div ref={mountRef} className="w-full h-[300px] rounded-lg bg-card mb-8" />
      <div className="w-full max-w-lg space-y-8 mx-auto">
        <Card>
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
          <Card className="bg-secondary/50">
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
  );
}
