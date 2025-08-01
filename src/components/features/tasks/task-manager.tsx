
'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  addDoc,
} from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2, Dices, Trash2, X, Upload, CalendarPlus, ListChecks, RefreshCw, ChevronsDown, FileText, MoreHorizontal, Power } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import type { CategorizeAndPrioritizeTasksOutput } from '@/ai/flows/categorize-and-prioritize-tasks';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
    processTasks,
    emptyJar,
    deleteTask,
    toggleTask,
    callSyncToGoogleTasks,
    callCreateCalendarEvent,
    callGenerateSubtasks,
    callImportFromGoogleDoc
} from './task-actions';

type Task = CategorizeAndPrioritizeTasksOutput[0] & { 
    id: string;
    completed: boolean;
    createdAt: Timestamp;
};

const initialTasks: Task[] = [
    { id: 't1', task: 'Develop the new feature for the main project', category: 'Work', priority: 9, completed: false, createdAt: new Timestamp(1722379964, 0) },
    { id: 't2', task: 'Schedule a dentist appointment', category: 'Health', priority: 7, completed: false, createdAt: new Timestamp(1722379963, 0) },
    { id: 't3', task: 'Buy groceries for the week', category: 'Errand', priority: 5, completed: true, createdAt: new Timestamp(1722379962, 0) },
    { id: 't4', task: 'Call mom for her birthday', category: 'Personal', priority: 10, completed: false, createdAt: new Timestamp(1722379961, 0) },
    { id: 't5', task: 'Read one chapter of the new book', category: 'Learning', priority: 4, completed: false, createdAt: new Timestamp(1722379960, 0) },
];

export function TaskManager() {
  const { user, googleAccessToken, connectGoogle } = useAuth();
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [drawnTask, setDrawnTask] = useState<Task | null>(null);
  const [subtaskState, setSubtaskState] = useState<{task: Task | null, loading: boolean, subtasks: string[]}>({ task: null, loading: false, subtasks: [] });
  const [isDocImportOpen, setIsDocImportOpen] = useState(false);
  const [googleDocId, setGoogleDocId] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [playAddAnimation, setPlayAddAnimation] = useState<Task | null>(null);
  const [playRemoveAnimation, setPlayRemoveAnimation] = useState(false);
  const [pending3DTasks, setPending3DTasks] = useState<CategorizeAndPrioritizeTasksOutput>([]);
  const [textAreaKey, setTextAreaKey] = useState(0);
  const [authAction, setAuthAction] = useState<(() => void) | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const { toast } = useToast();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

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
    let draggedObject: THREE.Object3D | null = null;
    const dragPlane = new THREE.Plane();
    const dragOffset = new THREE.Vector3();

    const originalColor = new THREE.Color(0x8BAA7A);
    const clickColor = new THREE.Color(0xE5989B);
    
    let animatedObjects: { mesh: THREE.Mesh; progress: number; type: 'add' | 'remove', targetPosition: THREE.Vector3, startPosition: THREE.Vector3 }[] = [];
    
    const animationDuration = 0.3; 
    const taskAnimationDuration = 1.0;
    let animationState = { isAnimating: false, progress: 0, type: '' };

    if (playAddAnimation) {
        animatedObjects.push({ 
            mesh: new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: 0xffffff })), 
            progress: 0, 
            type: 'add',
            startPosition: new THREE.Vector3(Math.random() * 4 - 2, Math.random() * 4 - 2, 2),
            targetPosition: new THREE.Vector3(0,0,0)
        });
        animatedObjects[animatedObjects.length-1].mesh.position.copy(animatedObjects[animatedObjects.length-1].startPosition);
        scene.add(animatedObjects[animatedObjects.length-1].mesh);
        setPlayAddAnimation(null);
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
    
    const onMouseDown = (event: MouseEvent) => {
        if (!currentMount || !model) return;
        const rect = currentMount.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        const clickableObjects = scene.children.filter(c => c.userData.isPendingTask);

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            if(clickableObjects.includes(intersectedObject)) {
                draggedObject = intersectedObject;
                dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(dragPlane.normal), draggedObject.position);
                const intersectionPoint = new THREE.Vector3();
                raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
                dragOffset.copy(intersectionPoint).sub(draggedObject.position);
            } else if (intersectedObject === model) {
                animationState = { isAnimating: true, progress: 0, type: 'click' };
            }
        }
    };
    
    const onMouseMove = (event: MouseEvent) => {
        if (!draggedObject || !currentMount) return;
        const rect = currentMount.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
        draggedObject.position.copy(intersectionPoint).sub(dragOffset);
    };

    const onMouseUp = async () => {
        if (draggedObject && model) {
            const jarBox = new THREE.Box3().setFromObject(model);
            const taskBox = new THREE.Box3().setFromObject(draggedObject);

            if (jarBox.intersectsBox(taskBox)) {
                const taskData = pending3DTasks.find(t => t.task === draggedObject?.userData.taskName);
                if (taskData && user) {
                    try {
                        const docRef = await addDoc(collection(db, 'tasks'), { 
                            ...taskData, 
                            userId: user.uid, 
                            createdAt: Timestamp.now(), 
                            completed: false 
                        });
                         setPlayAddAnimation({ ...taskData, id: docRef.id, completed: false, createdAt: Timestamp.now() });
                        setPending3DTasks(prev => prev.filter(t => t.task !== taskData.task));
                    } catch (error) {
                         console.error("Error adding task from drop:", error);
                    }
                }
            }
            draggedObject = null;
        }
    };
    
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

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
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
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
  }, [playAddAnimation, playRemoveAnimation, pending3DTasks, user]);

  useEffect(() => {
    if (!sceneRef.current) return;

    sceneRef.current.children.slice().forEach(child => {
        if (child.userData.isPendingTask) {
            sceneRef.current?.remove(child);
        }
    });

    pending3DTasks.forEach((task, index) => {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(-3 + (index % 3) * 3, 2 - Math.floor(index / 3) * 2, 0);
        cube.userData = { isPendingTask: true, taskName: task.task };
        sceneRef.current?.add(cube);
    });
  }, [pending3DTasks]);


  useEffect(() => {
    if (!user) {
      setTasks(initialTasks);
      return;
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty && user) {
            setTasks([]);
            return;
        }
      const fetchedTasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        fetchedTasks.push({ ...doc.data(), id: doc.id } as Task);
      });
      setTasks(fetchedTasks.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    });

    return () => unsubscribe();
  }, [user]);

  const handleProcessTasks = async () => {
    if (!user) {
        toast({ title: 'Not signed in', description: 'You must be signed in to add tasks.', variant: 'destructive' });
        return;
    }
    if (!taskInput.trim()) {
      toast({
        title: 'No tasks entered',
        description: 'Please enter some tasks to process.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await processTasks(user.uid, taskInput);
      setPending3DTasks(prev => [...prev, ...result]);
      setTaskInput('');
      toast({
        title: 'Tasks Ready to Add',
        description: `Drag the new items into the jar to save them.`
      })
    } catch (error) {
      console.error('Error processing tasks:', error);
      toast({
        title: 'Error Processing Tasks',
        description: 'Failed to process and save tasks. The AI may be unavailable, or there might be a connection issue. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };
  
  const handleDrawTask = () => {
    const pendingTasks = tasks.filter(t => !t.completed);
    if (pendingTasks.length === 0) {
        toast({ title: "All tasks completed!", description: "Add new tasks to draw one."});
        return;
    };

    const weightedList = pendingTasks.flatMap(task => Array(task.priority).fill(task));
    const randomIndex = Math.floor(Math.random() * weightedList.length);
    const selectedTask = weightedList[randomIndex];
    setDrawnTask(selectedTask);
  };
  
  const handleEmptyJar = async () => {
    if (!user) return;
    
    const tasksToDelete = tasks.map(t => t.id);
    const batchSize = 10;
    for (let i = 0; i < tasksToDelete.length; i += batchSize) {
        const batch = tasksToDelete.slice(i, i + batchSize);
        batch.forEach(() => setPlayRemoveAnimation(true));
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    try {
        await emptyJar(user.uid);
        toast({
            title: 'Jar Emptied',
            description: 'All tasks have been cleared from your account.',
        });
    } catch (error) {
        console.error("Error emptying jar: ", error);
        toast({ title: "Error", description: "Could not empty the task jar. Please try again.", variant: "destructive" });
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
        await deleteTask(taskId);
        setPlayRemoveAnimation(true);
        toast({
            title: "Task Deleted",
            description: "The task has been removed from your jar."
        });
    } catch (error) {
        console.error("Error deleting task: ", error);
        toast({ title: "Error", description: "Could not delete the task. Please try again.", variant: "destructive" });
    }
  }

  const handleToggleTask = async (task: Task) => {
    try {
        await toggleTask(task);
    } catch (error) {
        console.error("Error toggling task: ", error);
        toast({ title: "Error", description: "Could not update the task status. Please try again.", variant: "destructive" });
    }
  }

  const handleAuthForApi = async (callback: (token: string) => void) => {
    if (googleAccessToken) {
        callback(googleAccessToken);
        return;
    }
    
    setAuthAction(() => async () => {
        const token = await connectGoogle();
        if(token) {
            callback(token);
        }
    });
    setIsAuthDialogOpen(true);
  }

  const handleSyncToGoogleTasks = () => {
    handleAuthForApi(async (token) => {
      setIsSyncing(true);
      try {
        const result = await callSyncToGoogleTasks(token, tasks);
        if (result.success) {
            toast({
                title: 'Sync Successful!',
                description: result.message,
                action: (
                    <a href={result.tasklistLink!} target="_blank" rel="noopener noreferrer">
                       <Button variant="outline">View Tasks</Button>
                    </a>
                )
            });
        } else {
            throw new Error(result.message);
        }
      } catch (error: any) {
          console.error('Error syncing with Google Tasks:', error);
          toast({ title: 'Sync Error', description: error.message || 'Failed to sync tasks with Google. Please try again.', variant: 'destructive' });
      } finally {
        setIsSyncing(false);
      }
    });
  }

  const handleCreateCalendarEvent = () => {
    if (!drawnTask) return;
    
    handleAuthForApi(async (token) => {
      setIsCreatingEvent(true);
      try {
        const taskToEvent = { ...drawnTask, createdAt: drawnTask.createdAt.toMillis() };
        const result = await callCreateCalendarEvent(token, taskToEvent);
        if (result.success) {
            toast({
                title: 'Event Created!',
                description: result.message,
                action: (
                    <a href={result.eventLink!} target="_blank" rel="noopener noreferrer">
                       <Button variant="outline">View Event</Button>
                    </a>
                )
            });
        } else {
            throw new Error(result.message);
        }
      } catch (error: any) {
          console.error('Error creating calendar event:', error);
          toast({ title: 'Calendar Error', description: error.message || 'Failed to create event in Google Calendar.', variant: 'destructive' });
      } finally {
        setIsCreatingEvent(false);
        setDrawnTask(null);
      }
    });
  }

  const handleGenerateSubtasks = async (task: Task) => {
    if (!user) {
      toast({ title: "Not Signed In", description: "You need to be signed in to use this feature." });
      return;
    }
    setSubtaskState({ task: task, loading: true, subtasks: [] });
    try {
        const result = await callGenerateSubtasks({ task: task.task });
        setSubtaskState({ task: task, loading: false, subtasks: result.subtasks });
    } catch (error) {
        console.error("Error generating subtasks: ", error);
        toast({ title: 'AI Error', description: 'Could not generate subtasks. Please try again.', variant: 'destructive' });
        setSubtaskState({ task: null, loading: false, subtasks: [] });
    }
  }

  const handleConfirmImport = () => {
    handleAuthForApi(async (token) => {
      if (!googleDocId) {
          toast({ title: 'No Document ID', description: 'Please paste the ID of your Google Doc.', variant: 'destructive' });
          return;
      }
      setIsImporting(true);
      try {
          const result = await callImportFromGoogleDoc(token, googleDocId);
          if (result.success && result.content) {
              setTaskInput(prev => prev ? `${prev}\n${result.content}` : result.content);
              setTextAreaKey(k => k + 1); // Force re-render of textarea
              toast({ title: 'Import Successful', description: 'Your Google Doc content has been added to the text area.'});
              setIsDocImportOpen(false);
              setGoogleDocId('');
          } else {
              throw new Error(result.message || "Failed to import document.");
          }
      } catch (error: any) {
          console.error("Error importing from Google Doc: ", error);
          toast({ title: 'Import Error', description: error.message, variant: 'destructive' });
      } finally {
        setIsImporting(false);
      }
    });
  }


  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-500';
    if (priority >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <>
    <AlertDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Connect Google Account</AlertDialogTitle>
                <AlertDialogDescription>
                    To use this feature, you need to connect your Google account. This will allow ZenJar to securely access your Google services.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                    authAction?.();
                    setIsAuthDialogOpen(false);
                }}>
                    <Power className="mr-2 h-4 w-4" />
                    Connect Google
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={isDocImportOpen} onOpenChange={setIsDocImportOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Import from Google Docs</AlertDialogTitle>
                <AlertDialogDescription>
                    Paste the ID from your Google Doc's URL to import its content. For example, if your URL is `.../d/DOCUMENT_ID/edit`, paste "DOCUMENT_ID". Ensure sharing settings allow access.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <Input 
                placeholder="Paste Google Doc ID here"
                value={googleDocId}
                onChange={(e) => setGoogleDocId(e.target.value)}
                disabled={isImporting}
            />
            <AlertDialogFooter>
                <AlertDialogCancel disabled={isImporting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmImport} disabled={isImporting}>
                    {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />}
                    Import
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={!!subtaskState.task} onOpenChange={(open) => !open && setSubtaskState({ task: null, loading: false, subtasks: [] })}>
        {subtaskState.task && (
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle asChild>
                      <h2 className="font-headline flex items-center gap-2"><Wand2 /> AI Generated Sub-tasks</h2>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Here are some smaller steps to help you tackle: <span className="font-bold text-foreground">{subtaskState.task.task}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {subtaskState.loading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {subtaskState.subtasks.map((subtask, index) => (
                            <div key={index} className="flex items-start gap-3 text-sm p-3 bg-secondary/50 rounded-md">
                                <ListChecks className="h-4 w-4 mt-1 text-accent flex-shrink-0" />
                                <span className='flex-1'>{subtask}</span>
                            </div>
                        ))}
                    </div>
                )}
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setSubtaskState({ task: null, loading: false, subtasks: [] })}>Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        )}
    </AlertDialog>

     <div className="w-full h-[300px] bg-background rounded-lg mb-8">
        <div ref={mountRef} className="w-full h-full" />
    </div>
    <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle asChild>
                      <h2 className="font-headline flex items-center gap-2"><Wand2 className="text-accent" /> Brain Dump</h2>
                    </CardTitle>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" disabled={!user}>
                            <MoreHorizontal className="h-4 w-4" /> <span className='ml-2'>More Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Data Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => setIsDocImportOpen(true)} disabled={!user}>
                                <FileText className="mr-2 h-4 w-4" />
                                Import from Google Doc
                            </DropdownMenuItem>
                             <DropdownMenuItem onSelect={handleSyncToGoogleTasks} disabled={isSyncing || !user}>
                            {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4" />}
                            Sync to Google Tasks
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardDescription>
                Enter your tasks below. They will appear as items to drag into the jar.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleProcessTasks();
                }}
                >
                <Textarea
                    key={textAreaKey}
                    placeholder="e.g., Finish project report, Buy groceries, Call mom"
                    className="min-h-[150px]"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    disabled={!user || isLoading}
                />
                <Button type="submit" className="mt-4 w-full" disabled={!user || isLoading}>
                    {isLoading ? (
                    <Loader2 className="animate-spin" />
                    ) : (
                    'Process with AI'
                    )}
                </Button>
                </form>
                {!user && (
                    <p className="text-sm text-center text-muted-foreground mt-4">Please sign in to add and manage tasks.</p>
                )}
            </CardContent>
            </Card>
        </div>
        <div className="relative">
            <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle asChild>
                      <h2 className="font-headline">Your Tasks</h2>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" disabled={pendingTasksCount === 0} onClick={handleDrawTask}>
                                                <Dices className="h-4 w-4" />
                                                <span className="sr-only">Draw a task</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Draw a Task</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </AlertDialogTrigger>
                            {drawnTask && (
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle asChild>
                                      <h2 className="font-headline">Your Next Task!</h2>
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Based on priority, the universe has selected this for you. What would you like to do with it?
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="p-4 bg-secondary rounded-lg my-4">
                                        <p className="font-bold text-lg">{drawnTask.task}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge>{drawnTask.category}</Badge>
                                            <Badge variant="secondary">Priority: {drawnTask.priority}</Badge>
                                        </div>
                                    </div>
                                    <AlertDialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
                                    <Button variant="outline" onClick={handleCreateCalendarEvent} disabled={isCreatingEvent}>
                                        {isCreatingEvent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarPlus className="mr-2 h-4 w-4" />}
                                        Add to Google Calendar
                                    </Button>
                                    <AlertDialogAction onClick={() => setDrawnTask(null)}>Let's do it!</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            )}
                        </AlertDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="destructive" size="icon" disabled={tasks.length === 0}>
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Empty Jar</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Empty Jar</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This will permanently delete all {tasks.length} tasks from your jar. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleEmptyJar}>Yes, empty the jar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <CardDescription>
                    {tasks.length > 0 ? `You have ${pendingTasksCount} pending task(s).` : "Your task jar is empty. Add some tasks!"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-3 pr-2">
                {
                    tasks.length > 0 ? (
                    <>
                    {tasks.filter(t => !t.completed).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <Checkbox id={`task-${item.id}`} checked={item.completed} onCheckedChange={() => handleToggleTask(item)} />
                        <div className={`w-2 h-10 rounded-full ${getPriorityColor(item.priority)}`}></div>
                        <div className="flex-1">
                            <p className="font-medium">{item.task}</p>
                            <Badge variant="outline" className="mt-1">{item.category}</Badge>
                        </div>
                        <div className="text-sm font-bold mr-2">{item.priority}</div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleGenerateSubtasks(item)}>
                                        <Wand2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Break down with AI</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteTask(item.id)}>
                            <X className="h-4 w-4" />
                        </Button>
                        </div>
                    ))}
                    {completedTasks.length > 0 && (
                        <div className="pt-4">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Completed</h4>
                            {completedTasks.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg text-muted-foreground">
                                    <Checkbox id={`task-${item.id}`} checked={item.completed} onCheckedChange={() => handleToggleTask(item)} />
                                    <div className="flex-1">
                                        <p className="font-medium line-through">{item.task}</p>
                                        <Badge variant="outline" className="mt-1">{item.category}</Badge>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteTask(item.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    </>
                    ) : (
                    <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                        <p>Tasks will appear here once processed.</p>
                    </div>
                    )
                }
                </div>
            </CardContent>
            </Card>
        </div>
    </div>
    </>
  );
}
