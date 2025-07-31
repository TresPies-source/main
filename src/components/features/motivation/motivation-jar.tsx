
'use client';

import { useState, useEffect, Suspense, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
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
  "The secret of getting ahead is getting started.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "The best way to predict the future is to create it.",
  "Perfection is not attainable, but if we chase perfection we can catch excellence.",
  "You don’t have to be great to start, but you have to start to be great.",
  "A little progress each day adds up to big results.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Focus on progress, not perfection.",
  "It always seems impossible until it's done.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Don't let yesterday take up too much of today.",
  "The journey of a thousand miles begins with a single step.",
  "You have to be odd to be number one.",
  "Your limitation is only your imagination.",
  "Push yourself, because no one else is going to do it for you."
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
    
    const animationDuration = 0.3;
    let animatedObjects: { mesh: THREE.Mesh; progress: number; type: 'add' | 'remove', targetPosition: THREE.Vector3, startPosition: THREE.Vector3 }[] = [];
    let animationState = { isAnimating: false, progress: 0, type: '' };
    
    if (playAddAnimation) {
      animationState = { isAnimating: true, progress: 0, type: 'pop' };
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

      if (model) {
        model.rotation.y += 0.005;
      }

      if (animationState.isAnimating && model) {
        animationState.progress += deltaTime;
        const phase = animationState.progress / animationDuration;
        
        if (animationState.type === 'pop') {
            if (phase < 1) {
              const scale = 1 + 0.2 * Math.sin(phase * Math.PI);
              model.scale.set(scale, scale, scale);
            } else {
              model.scale.set(1, 1, 1);
              animationState.isAnimating = false;
            }
        } else if (animationState.type === 'click') {
            if (phase < 1) {
                (model.material as THREE.MeshStandardMaterial).color.lerpColors(originalColor, clickColor, Math.sin(phase * Math.PI));
            } else {
                (model.material as THREE.MeshStandardMaterial).color.copy(originalColor);
                animationState.isAnimating = false;
            }
        }
      }

      animatedObjects.forEach((obj, index) => {
        obj.progress += deltaTime / 1.0; // taskAnimationDuration
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
    if (!user) {
      setCustomAffirmations([]);
    } else {
        const q = query(collection(db, 'affirmations'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userAffirmations: Affirmation[] = [];
            snapshot.forEach(doc => {
                userAffirmations.push({ ...doc.data(), id: doc.id } as Affirmation);
            });
            setCustomAffirmations(userAffirmations);
        });
        return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    drawQuote();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customAffirmations]);

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
        setPlayRemoveAnimation(true);
        toast({ title: 'Affirmation removed.' });
    } catch (error) {
        console.error("Error deleting affirmation: ", error);
        toast({ title: "Error", description: "Could not remove affirmation.", variant: "destructive"});
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full h-[300px] bg-background rounded-lg mb-8">
        <div ref={mountRef} className="w-full h-full" />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="md:col-span-1">
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
        </div>

        <div className="md:col-span-1">
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
    </div>
  );
}
