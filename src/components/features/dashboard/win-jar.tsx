'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Award } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export function WinJar() {
  const [wins, setWins] = useState<string[]>(['Completed the app design']);
  const [newWin, setNewWin] = useState('');
  const { toast } = useToast();

  const handleAddWin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWin.trim()) {
      setWins(prev => [newWin, ...prev]);
      setNewWin('');
      toast({
        title: 'Win Logged!',
        description: 'Another accomplishment in the jar.',
      });
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Win Jar</CardTitle>
        <CardDescription>Log your accomplishments.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <form onSubmit={handleAddWin} className="flex gap-2">
          <Input 
            placeholder="e.g., Woke up on time" 
            value={newWin}
            onChange={(e) => setNewWin(e.target.value)}
          />
          <Button type="submit" size="icon" aria-label="Add win">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <ScrollArea className="mt-4 flex-1 h-[120px]">
          <div className="space-y-2 pr-4">
            {wins.length > 0 ? wins.map((win, index) => (
              <div key={index} className="flex items-center gap-3 text-sm p-2 bg-secondary/50 rounded-md">
                <Award className="h-4 w-4 text-accent flex-shrink-0"/>
                <span>{win}</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center pt-8">No wins logged yet.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
