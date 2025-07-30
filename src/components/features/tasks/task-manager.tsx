'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, Dices, Trash2 } from 'lucide-react';
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

export function TaskManager() {
  const [taskInput, setTaskInput] = useState('');
  const [processedTasks, setProcessedTasks] = useState<CategorizeAndPrioritizeTasksOutput>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawnTask, setDrawnTask] = useState<CategorizeAndPrioritizeTasksOutput[0] | null>(null);
  const { toast } = useToast();

  const handleProcessTasks = async () => {
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
      setProcessedTasks(prevTasks => [...prevTasks, ...result]);
      setTaskInput('');
    } catch (error) {
      console.error('Error processing tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to process tasks. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };
  
  const handleDrawTask = () => {
    if (processedTasks.length === 0) return;

    const weightedList = processedTasks.flatMap(task => Array(task.priority).fill(task));
    const randomIndex = Math.floor(Math.random() * weightedList.length);
    const selectedTask = weightedList[randomIndex];
    setDrawnTask(selectedTask);
  };
  
  const handleEmptyJar = () => {
    setProcessedTasks([]);
    toast({
        title: 'Jar Emptied',
        description: 'All tasks have been cleared.',
    })
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-500';
    if (priority >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Wand2 className="text-accent" />
              Brain Dump
            </CardTitle>
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
              />
              <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Process with AI'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="min-h-[365px]">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="font-headline">Your Tasks</CardTitle>
                <div className="flex items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="outline" size="icon" disabled={processedTasks.length === 0} onClick={handleDrawTask}>
                                <Dices className="h-4 w-4" />
                                <span className="sr-only">Draw a task</span>
                            </Button>
                        </AlertDialogTrigger>
                         {drawnTask && (
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle className="font-headline">Your Next Task!</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Based on priority, the universe has selected this for you.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="p-4 bg-secondary rounded-lg my-4">
                                    <p className="font-bold text-lg">{drawnTask.task}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge>{drawnTask.category}</Badge>
                                        <Badge variant="secondary">Priority: {drawnTask.priority}</Badge>
                                    </div>
                                </div>
                                <AlertDialogFooter>
                                <AlertDialogAction>Let's do it!</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                         )}
                    </AlertDialog>
                     <Button variant="destructive" size="icon" onClick={handleEmptyJar} disabled={processedTasks.length === 0}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Empty Jar</span>
                    </Button>
                </div>
            </div>
            <CardDescription>
                {processedTasks.length > 0 ? `You have ${processedTasks.length} task(s).` : "Your task jar is empty. Add some tasks!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 h-[200px] overflow-y-auto pr-2">
              {processedTasks.length > 0 ? (
                processedTasks.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <div className={`w-2 h-10 rounded-full ${getPriorityColor(item.priority)}`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{item.task}</p>
                      <Badge variant="outline" className="mt-1">{item.category}</Badge>
                    </div>
                    <div className="text-sm font-bold">{item.priority}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground pt-12">
                    <p>Tasks will appear here once processed.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
