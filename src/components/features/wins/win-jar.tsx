
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

const initialWins: Win[] = [
    { id: 'w1', text: 'Finished the presentation ahead of schedule', createdAt: { seconds: 1722379964, nanoseconds: 0 } },
    { id: 'w2', text: 'Went for a 30-minute run', createdAt: { seconds: 1722379963, nanoseconds: 0 } },
    { id: 'w3', text: 'Cooked a healthy meal instead of ordering out', createdAt: { seconds: 1722379962, nanoseconds: 0 } },
    { id: 'w4', text: 'Cleaned out the garage', createdAt: { seconds: 1722379961, nanoseconds: 0 } },
    { id: 'w5', text: 'Read 50 pages of a book', createdAt: { seconds: 1722379960, nanoseconds: 0 } },
];

export function WinJar() {
  const { user } = useAuth();
  const [wins, setWins] = useState<Win[]>(initialWins);
  const [newWin, setNewWin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playAddAnimation, setPlayAddAnimation] = useState(false);
  const [playRemoveAnimation, setPlayRemoveAnimation] = useState(false);
  const { toast } = useToast();
  const mountRef = useRef<HTMLDivElement>(null);

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
    
    let animatedObjects: { mesh: THREE.Mesh; progress: number; type: 'add' | 'remove', targetPosition: THREE.Vector3, startPosition: THREE.Vector3 }[] = [];
    const animationDuration = 0.3;
    const taskAnimationDuration = 1.0;
    let animationState = { isAnimating: false, progress: 0, type: '' };

    if (playAddAnimation) {
      animationState = { isAnimating: true, progress: 0, type: 'addTask' };
      setPlayAddAnimation(false);
    }

    if (playRemoveAnimation) {
        animatedObjects.push({ 
            mesh: new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: 0xff0000 })), 
            progress: 0, 
            type: 'remove',
            startPosition: new THREE.Vector3(0,0,0),
            targetPosition: new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, 3)
        });
        animatedObjects[animatedObjects.length-1].mesh.position.copy(animatedObjects[animatedObjects.length-1].startPosition);
        scene.add(animatedObjects[animatedObjects.length-1].mesh);
        setPlayRemoveAnimation(false);
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

      if(model) {
        model.rotation.y += 0.005;
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
            animatedObjects.push({ 
                mesh: taskCube, 
                progress: 0,
                type: 'add',
                startPosition: taskCube.position.clone(),
                targetPosition: new THREE.Vector3(0,0,0)
             });
            animationState.isAnimating = false; // Reset for next trigger
        }
      }
      
      animatedObjects.forEach((obj, index) => {
        obj.progress += deltaTime / taskAnimationDuration;
        if (obj.progress < 1) {
            obj.mesh.position.lerp(obj.targetPosition, deltaTime * 2);
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
  }, [playAddAnimation, playRemoveAnimation]);

  useEffect(() => {
    if (!user) {
      setWins(initialWins);
      return;
    }

    const q = query(
      collection(db, 'wins'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty && user) {
            setWins([]);
            return;
        }
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
        setPlayRemoveAnimation(true);
        toast({ title: 'Win removed.' });
    } catch (error) {
        console.error("Error deleting win:", error);
        toast({ title: "Error", description: "Could not remove win.", variant: "destructive"});
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
       <div className="w-full h-[300px] bg-background rounded-lg mb-8">
        <div ref={mountRef} className="w-full h-full" />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="md:col-span-1">
          <Card className="shadow-lg">
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
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle className="font-headline">Your Wins</CardTitle>
              <CardDescription>A list of your recent accomplishments.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-4">
                  {
                    wins.length > 0 ? wins.map((win) => (
                      <div key={win.id} className="group flex items-center justify-between gap-3 text-sm p-3 bg-secondary/50 rounded-md">
                        <span className='flex-1'>{win.text}</span>
                        {user && initialWins.findIndex(iw => iw.id === win.id) === -1 && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteWin(win.id)}>
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No wins logged yet. Add one above!</p>
                    )
                  }
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
