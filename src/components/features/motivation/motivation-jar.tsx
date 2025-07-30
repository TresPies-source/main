'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Sparkles } from 'lucide-react';

const quotes = [
  "The secret of getting ahead is getting started.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you’ve ever wanted is on the other side of fear.",
  "The journey of a thousand miles begins with a single step.",
  "What you get by achieving your goals is not as important as what you become by achieving your goals.",
  "The future belongs to those who believe in the beauty of their dreams."
];

export function MotivationJar() {
  const [currentQuote, setCurrentQuote] = useState('');

  const drawQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };
  
  useEffect(() => {
    drawQuote();
  }, []);

  return (
    <Card className="w-full max-w-2xl text-center shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-center gap-2">
          <Sparkles className="text-accent" /> A Dose of Motivation
        </CardTitle>
        <CardDescription>Click the button for a burst of inspiration.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="min-h-[100px] flex items-center justify-center p-4">
            {currentQuote ? (
                <blockquote className="text-xl italic font-medium text-center">
                "{currentQuote}"
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
  );
}
