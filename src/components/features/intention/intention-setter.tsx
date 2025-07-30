'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sunrise, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateEncouragingResponse } from '@/ai/flows/generate-encouraging-response';

export function IntentionSetter() {
  const [intention, setIntention] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const result = await generateEncouragingResponse({ intention });
      setResponse(result.response);
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
    <div className="max-w-4xl mx-auto grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sunrise className="text-accent" />
            What is your intention for today?
          </CardTitle>
          <CardDescription>
            Set a clear goal or focus for your day. The AI will give you a little boost.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="e.g., To be present in every conversation, to complete my most important task, to drink more water..."
              value={intention}
              onChange={e => setIntention(e.target.value)}
              className="min-h-[100px]"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
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
  );
}
