

'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
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
import { Loader2, Wand2, Dices, Trash2, X, Upload, CalendarPlus, ListChecks, RefreshCw, ChevronsDown, FileText } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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


export function TaskManager() {
  const { user, googleAccessToken, connectGoogle } = useAuth();
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [drawnTask, setDrawnTask] = useState<Task | null>(null);
  const [subtaskState, setSubtaskState] = useState<{task: Task | null, loading: boolean, subtasks: string[]}>({ task: null, loading: false, subtasks: [] });
  const [isDocImportOpen, setIsDocImportOpen] = useState(false);
  const [googleDocId, setGoogleDocId] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [playAddAnimation, setPlayAddAnimation] = useState(false);
  const { toast } = useToast();
  const mountRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f0e9);
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Jar
    const geometry = new THREE.BoxGeometry(1.5, 2, 1.5);
    const material = new THREE.MeshStandardMaterial({ color: 'royalblue' });
    const jarMesh = new THREE.Mesh(geometry, material);
    scene.add(jarMesh);
    
    // Animation variables
    let isAnimating = false;
    let animationProgress = 0;
    const animationDuration = 0.3; // seconds

    // Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();

      if (isAnimating) {
        animationProgress += deltaTime;
        const phase = animationProgress / animationDuration;

        if (phase < 0.5) {
          // Scaling up
          const scale = 1 + 0.2 * Math.sin(phase * 2 * Math.PI);
          jarMesh.scale.set(scale, scale, scale);
        } else if (phase < 1) {
          // Scaling down
           const scale = 1 + 0.2 * Math.sin(phase * 2 * Math.PI);
          jarMesh.scale.set(scale, scale, scale);
        } else {
          // End of animation
          jarMesh.scale.set(1, 1, 1);
          isAnimating = false;
          animationProgress = 0;
        }
      }

      jarMesh.rotation.y += 0.005;

      renderer.render(scene, camera);
    };
    
    if (playAddAnimation) {
        isAnimating = true;
        setPlayAddAnimation(false); // Reset state after triggering
    }

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
    if (!user) {
      setTasks([]);
      return;
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
      setTaskInput('');
      setPlayAddAnimation(true);
      toast({
        title: 'Tasks Added',
        description: `${result.length} new task(s) have been saved to your jar.`
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

  const handleAuthForApi = async () => {
    let token = googleAccessToken;
    if (!token) {
        token = await connectGoogle();
    }
    if (!token) {
        toast({ title: 'Authentication Failed', description: 'Could not get Google access token. Please try connecting your account again from Settings.', variant: 'destructive' });
        return null;
    }
    return token;
  }

  const handleSyncToGoogleTasks = async () => {
    setIsSyncing(true);
    try {
        const token = await handleAuthForApi();
        if (!token) {
            setIsSyncing(false);
            return;
        }

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
    }
    setIsSyncing(false);
  }

  const handleCreateCalendarEvent = async () => {
    if (!drawnTask) return;
    
    setIsCreatingEvent(true);
    try {
        const token = await handleAuthForApi();
        if (!token) {
            setIsCreatingEvent(false);
            return;
        }
        
        const result = await callCreateCalendarEvent(token, drawnTask);
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
    }
    setIsCreatingEvent(false);
    setDrawnTask(null); // Close the dialog
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

  const handleConfirmImport = async () => {
    if (!googleDocId) {
        toast({ title: 'No Document ID', description: 'Please paste the ID of your Google Doc.', variant: 'destructive' });
        return;
    }
    setIsImporting(true);

    try {
        const token = await handleAuthForApi();
        if(!token) {
            setIsImporting(false);
            return;
        }
        
        const result = await callImportFromGoogleDoc(token, googleDocId);
        if (result.success && result.content) {
            setTaskInput(prev => prev ? `${prev}\n${result.content}` : result.content);
            toast({ title: 'Import Successful', description: 'Your Google Doc content has been added to the text area.'});
            setIsDocImportOpen(false);
            setGoogleDocId('');
        } else {
            throw new Error(result.message || "Failed to import document.");
        }
    } catch (error: any) {
        console.error("Error importing from Google Doc: ", error);
        toast({ title: 'Import Error', description: error.message, variant: 'destructive' });
    }

    setIsImporting(false);
  }


  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-500';
    if (priority >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <>
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
                    <AlertDialogTitle className="font-headline flex items-center gap-2">
                        <Wand2 /> AI Generated Sub-tasks
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

     <div className="relative h-full w-full">
        <div ref={mountRef} className="absolute inset-0 z-0" />
        <div className="absolute inset-0 z-10 grid md:grid-cols-2 gap-8 p-4">
            <div className="relative space-y-4">
                <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Wand2 className="text-accent" />
                                Brain Dump
                            </CardTitle>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" disabled={!user}>
                                <ChevronsDown className="mr-2 h-4 w-4" /> Import
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Import From</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => setIsDocImportOpen(true)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Google Doc
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <CardDescription>
                    Enter your tasks below. They will appear in the list on the right.
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
                <Card className="h-full bg-background/80 backdrop-blur-sm flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline">Your Tasks</CardTitle>
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                            <AlertDialog open={!!drawnTask} onOpenChange={(open) => !open && setDrawnTask(null)}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="icon" disabled={pendingTasks.length === 0} onClick={handleDrawTask}>
                                                <Dices className="h-4 w-4" />
                                                <span className="sr-only">Draw a task</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Draw a Task</TooltipContent>
                                </Tooltip>
                                {drawnTask && (
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle className="font-headline">Your Next Task!</AlertDialogTitle>
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
                                        <Button variant="outline" onClick={handleCreateCalendarEvent} disabled={isCreatingEvent || !googleAccessToken}>
                                            {isCreatingEvent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarPlus className="mr-2 h-4 w-4" />}
                                            Add to Google Calendar
                                        </Button>
                                        <AlertDialogAction onClick={() => setDrawnTask(null)}>Let's do it!</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                )}
                            </AlertDialog>
                            <AlertDialog>
                                <Tooltip>
                                <TooltipTrigger asChild>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon" disabled={tasks.length === 0}>
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Empty Jar</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Empty Jar</TooltipContent>
                                </Tooltip>
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
                            </TooltipProvider>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" disabled={tasks.length === 0 || !user}>
                                <RefreshCw className="h-4 w-4" />
                                <span className="sr-only">Export or Sync</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Export / Sync</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onClick={handleSyncToGoogleTasks} disabled={isSyncing}>
                                {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4" />}
                                Sync to Google Tasks
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <CardDescription>
                        {user ? (tasks.length > 0 ? `You have ${pendingTasks.length} pending task(s).` : "Your task jar is empty. Add some tasks!") : "Sign in to see your tasks."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                    <div className="space-y-3 pr-2">
                    {user ? (
                        tasks.length > 0 ? (
                        <>
                        {pendingTasks.map((item) => (
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
                    ) : (
                        <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                            <p>Please sign in to manage your tasks.</p>
                        </div>
                    )}
                    </div>
                </CardContent>
                </Card>
            </div>
        </div>
    </div>
    </>
  );
}

    