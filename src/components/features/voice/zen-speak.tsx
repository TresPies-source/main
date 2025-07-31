'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';


// Web Speech API interfaces might not be in default TS lib
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function ZenSpeak() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.lang = 'en-US';
    rec.interimResults = true;

    rec.onstart = () => {
        setIsListening(true);
        setTranscript('');
    };

    rec.onend = () => {
        setIsListening(false);
        if (transcript) { // only process if there is a transcript
            setIsProcessing(true);
            // Here we would call the backend, for now just simulate
            setTimeout(() => {
                setIsProcessing(false);
                console.log("Processed:", transcript);
            }, 2000);
        }
    };

    rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setIsProcessing(false);
    };

    rec.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
        setTranscript(currentTranscript);
    };

    setRecognition(rec);
  }, [transcript]);

  const handleToggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };
  
  const open = isListening || isProcessing;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                onClick={handleToggleListening}
                disabled={!recognition}
            >
                {isListening ? <MicOff className="text-red-500" /> : <Mic />}
                <span className="sr-only">Activate Voice Control</span>
            </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Activate Voice Control (ZenSpeak)</p>
        </TooltipContent>
      </Tooltip>
      <Dialog open={open}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
                <DialogTitle className="font-headline flex items-center gap-2">
                    <Mic /> ZenSpeak is listening...
                </DialogTitle>
                <DialogDescription>
                    Start speaking. You can add tasks, get motivation, and more.
                </DialogDescription>
            </DialogHeader>
            <div className="py-8 text-center text-lg font-medium min-h-[80px]">
                {transcript ? (
                    <p>{transcript}</p>
                ) : isListening ? (
                    <p className="text-muted-foreground">Say something...</p>
                ) : null}

                {isProcessing && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="animate-spin" />
                        <p>Processing...</p>
                    </div>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
