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
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { interpretVoiceCommand } from '@/ai/flows/interpret-voice-command';
import { categorizeAndPrioritizeTasks } from '@/ai/flows/categorize-and-prioritize-tasks';
import { generateEncouragingResponse } from '@/ai/flows/generate-encouraging-response';
import { getMotivation } from '@/services/jar-logic';


// Web Speech API interfaces might not be in default TS lib
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function ZenSpeak() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
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
        setFinalTranscript('');
    };

    rec.onend = () => {
        if(isListening) {
            setIsListening(false);
        }
    };

    rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            toast({
                title: "Microphone Access Denied",
                description: "Please allow microphone access in your browser settings to use ZenSpeak.",
                variant: 'destructive',
            })
        }
    };

    rec.onresult = (event: any) => {
        let interimTranscript = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        setTranscript(interimTranscript);
        if (final) {
            setFinalTranscript(final);
            rec.stop(); // Stop listening once we have a final result
        }
    };

    setRecognition(rec);
    
    return () => {
        if (rec) {
            rec.abort();
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  useEffect(() => {
    if (finalTranscript) {
      handleProcessCommand(finalTranscript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript, user]);

  const handleProcessCommand = async (command: string) => {
    if (!user) {
        toast({ title: 'Not signed in', description: 'Please sign in to use voice commands.', variant: 'destructive' });
        return;
    }
    setIsProcessing(true);
    try {
        const { intent, entity } = await interpretVoiceCommand({ command });

        switch(intent) {
            case 'addTask':
                if (entity) {
                    const taskResult = await categorizeAndPrioritizeTasks({ tasks: entity });
                    const task = taskResult[0];
                     await addDoc(collection(db, 'tasks'), {
                        ...task,
                        userId: user.uid,
                        createdAt: Timestamp.now(),
                        completed: false
                    });
                    toast({ title: 'Task Added', description: `Added "${task.task}" to your jar.` });
                } else {
                    toast({ title: 'Task not clear', description: 'I heard you want to add a task, but I did not catch the details.', variant: 'destructive' });
                }
                break;
            case 'getMotivation':
                const quote = await getMotivation(user.uid);
                toast({ title: 'A dose of motivation for you', description: `"${quote}"`});
                break;
            case 'addGratitude':
                if (entity) {
                    await addDoc(collection(db, 'gratitude'), {
                        text: entity,
                        rating: 3, // Default rating for voice entry
                        userId: user.uid,
                        createdAt: Timestamp.now(),
                    });
                    toast({ title: 'Gratitude Added', description: 'Your moment has been saved.' });
                } else {
                     toast({ title: 'Gratitude not clear', description: 'I heard you were grateful, but I did not catch for what.', variant: 'destructive' });
                }
                break;
            case 'setIntention':
                if (entity) {
                    const result = await generateEncouragingResponse({ intention: entity });
                    await addDoc(collection(db, 'intentions'), {
                        userId: user.uid,
                        intention: entity,
                        aiResponse: result.response,
                        createdAt: Timestamp.now(),
                    });
                    toast({ title: 'Intention Set!', description: result.response });
                } else {
                    toast({ title: 'Intention not clear', description: 'I heard you want to set an intention, but did not catch it.', variant: 'destructive' });
                }
                break;
            default:
                 toast({ title: 'Did not understand', description: "Sorry, I couldn't understand that command. Please try again.", variant: 'destructive' });
        }
    } catch (error) {
        console.error("Error processing voice command:", error);
        toast({ title: 'AI Error', description: 'There was an error processing your command.', variant: 'destructive' });
    }
    setIsProcessing(false);
    setFinalTranscript('');
    setTranscript('');
  }

  const handleToggleListening = () => {
    if (!recognition) {
        toast({ title: "Voice Not Supported", description: "Your browser doesn't support speech recognition.", variant: 'destructive'});
        return;
    };

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

                {finalTranscript && !isProcessing && (
                    <p>{finalTranscript}</p>
                )}

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
