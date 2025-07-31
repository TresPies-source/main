"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, CircleDashed, Rocket, Target, Bot } from "lucide-react";

const Feature = ({ icon, title, description, completed = false }: { icon: React.ReactNode, title: string, description: string, completed?: boolean }) => (
    <div className="flex items-start gap-4">
        <div className={`mt-1 ${completed ? "text-primary" : "text-muted-foreground"}`}>
            {completed ? <CheckCircle className="h-5 w-5" /> : <CircleDashed className="h-5 w-5" />}
        </div>
        <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);


export function RoadmapContent() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-4xl">Our Development Journey</CardTitle>
                    <CardDescription className="text-lg">We believe in building in the open. Here's a look at what we've accomplished and where we're headed.</CardDescription>
                </CardHeader>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Rocket className="text-primary"/>
                        Phase 1-6: Completed
                    </CardTitle>
                    <CardDescription>Core features, cross-platform MVP, public presence, and core integrations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Feature 
                        icon={<CheckCircle />}
                        title="Core Application & AI Foundation"
                        description="Setup of the Next.js app, Firebase backend, and the core AI flows for Tasks, Intentions, and Gratitude."
                        completed
                    />
                     <Feature 
                        icon={<CheckCircle />}
                        title="Growth Ecosystem & Performance"
                        description="The Focus Timer, Win Jar, and streak tracking are live. The app has been optimized for snappy page loads."
                        completed
                    />
                     <Feature 
                        icon={<CheckCircle />}
                        title="Security & Reliability"
                        description="Implemented Firestore security rules, environment variable management for secrets, and robust error handling."
                        completed
                    />
                     <Feature 
                        icon={<CheckCircle />}
                        title="Google Suite Integration"
                        description="Enabled syncing with Google Tasks, creating Google Calendar events, and importing from Google Docs."
                        completed
                    />
                     <Feature 
                        icon={<CheckCircle />}
                        title="Voice Control (ZenSpeak)"
                        description="The foundational AI and UI for hands-free voice commands are integrated into the web app."
                        completed
                    />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Target className="text-primary"/>
                        Phase 7: In Progress
                    </CardTitle>
                     <CardDescription>Advanced features and deeper integrations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Feature 
                        icon={<CircleDashed />}
                        title="Pro Tier Feature Rollout"
                        description="Implementing the Growth Dashboard, custom affirmations, and AI-powered sub-task generation."
                    />
                     <Feature 
                        icon={<CircleDashed />}
                        title="Advanced Integrations"
                        description="Connecting ZenJar with other popular productivity tools like Todoist, Notion, and Asana."
                    />
                    <Feature 
                        icon={<CircleDashed />}
                        title="Shared Jars & Collaboration"
                        description="Allow users to share specific jars with others for collaborative task management or shared motivation."
                    />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Bot className="text-primary"/>
                        Future Vision
                    </CardTitle>
                    <CardDescription>Our long-term goal is to make ZenJar a true AI companion for well-being.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <Feature 
                        icon={<CircleDashed />}
                        title="Proactive AI Agent"
                        description="Enabling ZenJar to proactively suggest tasks based on calendar events or generate personalized gratitude summaries."
                    />
                     <Feature 
                        icon={<CircleDashed />}
                        title="Deeper Personalization"
                        description="Training the AI to learn from user habits to provide even more tailored motivation and insights."
                    />
                </CardContent>
            </Card>

        </div>
    );
}
