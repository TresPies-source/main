
'use client';

import { useState, useEffect, Suspense, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
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
    
    const geometry = new THREE.ConeGeometry(1.5, 3, 32);
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

      if(model) {
        model.rotation.y += 0.005;
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
    <div className="flex flex-col h-full w-full">
      <div ref={mountRef} className="w-full h-[300px] rounded-lg bg-card mb-8" />
      <Card className="shadow-lg w-full max-w-lg mx-auto">
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
  );
}
