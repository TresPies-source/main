'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  writeBatch,
  getDocs,
  Timestamp,
  deleteDoc,
  updateDoc,
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
import { Loader2, Wand2, Dices, Trash2, X, Download, Upload, CalendarPlus } from 'lucide-react';
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
import {
  categorizeAndPrioritizeTasks,
  type CategorizeAndPrioritizeTasksOutput,
} from '@/ai/flows/categorize-and-prioritize-tasks';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

type Task = CategorizeAndPrioritizeTasksOutput[0] & { 
    id: string;
    completed: boolean;
    createdAt: Timestamp;
};

export function TaskManager() {
  const { user } = useAuth();
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawnTask, setDrawnTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        fetchedTasks.push({ ...doc.data(), id: doc.id } as Task);
      });
      setTasks(fetchedTasks);
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
      const result = await categorizeAndPrioritizeTasks({ tasks: taskInput });
      
      const batch = writeBatch(db);
      result.forEach((task) => {
        const docRef = doc(collection(db, 'tasks'));
        batch.set(docRef, { ...task, userId: user.uid, createdAt: Timestamp.now(), completed: false });
      });
      await batch.commit();

      setTaskInput('');
      toast({
        title: 'Tasks Added',
        description: `${result.length} new task(s) have been saved to your jar.`
      })
    } catch (error) {
      console.error('Error processing tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to process and save tasks. Please try again.',
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
    
    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    toast({
        title: 'Jar Emptied',
        description: 'All tasks have been cleared from your account.',
    })
  }

  const handleDeleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId));
    toast({
        title: "Task Deleted",
        description: "The task has been removed from your jar."
    })
  }

  const handleToggleTask = async (task: Task) => {
    const taskRef = doc(db, 'tasks', task.id);
    await updateDoc(taskRef, { completed: !task.completed });
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-500';
    if (priority >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="font-headline flex items-center gap-2">
                <Wand2 className="text-accent" />
                Brain Dump
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={!user}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Import From</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>Google Keep</DropdownMenuItem>
                  <DropdownMenuItem disabled>Google Docs</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>
              Enter your tasks below, separated by commas or new lines. Our AI will do the rest.
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

      <div>
        <Card className="min-h-[365px]">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="font-headline">Your Tasks</CardTitle>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" disabled={tasks.length === 0}>
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Export Tasks</span>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                          <DropdownMenuLabel>Export To</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled>Google Tasks</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="outline" size="icon" disabled={pendingTasks.length === 0} onClick={handleDrawTask}>
                                <Dices className="h-4 w-4" />
                                <span className="sr-only">Draw a task</span>
                            </Button>
                        </AlertDialogTrigger>
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
                                <AlertDialogFooter className="sm:justify-between">
                                  <Button variant="outline" disabled>
                                    <CalendarPlus className="mr-2 h-4 w-4" />
                                    Add to Google Calendar
                                  </Button>
                                  <AlertDialogAction>Let's do it!</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                         )}
                    </AlertDialog>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" disabled={tasks.length === 0}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Empty Jar</span>
                            </Button>
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
                {user ? (tasks.length > 0 ? `You have ${pendingTasks.length} pending task(s).` : "Your task jar is empty. Add some tasks!") : "Sign in to see your tasks."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 h-[200px] overflow-y-auto pr-2">
              {tasks.length > 0 ? (
                <>
                {pendingTasks.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Checkbox id={`task-${item.id}`} checked={item.completed} onCheckedChange={() => handleToggleTask(item)} />
                    <div className={`w-2 h-10 rounded-full ${getPriorityColor(item.priority)}`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{item.task}</p>
                      <Badge variant="outline" className="mt-1">{item.category}</Badge>
                    </div>
                    <div className="text-sm font-bold">{item.priority}</div>
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
                <div className="text-center text-muted-foreground pt-12">
                    {user ? <p>Tasks will appear here once processed.</p> : <p>Please sign in to manage your tasks.</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
