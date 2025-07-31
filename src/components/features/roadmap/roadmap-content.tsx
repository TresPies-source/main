"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, CircleDashed, Rocket, Target, Bot } from "lucide-react";

const Feature = ({ icon, title, description, completed = false }: { icon: React.ReactNode, title: string, description: string, completed?: boolean }) => (
    <div className="flex items-start gap-4">
        <div className={`mt-1 ${completed ? "text-green-500" : "text-muted-foreground"}`}>
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
                <CardHeader>
                    <CardTitle className="font-headline">Our Development Journey</CardTitle>
                    <CardDescription>We believe in building in the open. Here's a look at what we've accomplished and where we're headed.</CardDescription>
                </CardHeader>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Rocket className="text-primary"/>
                        Phase 1-5: Completed
                    </CardTitle>
                    <CardDescription>Core features and cross-platform MVP.</CardDescription>
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
                        title="Growth Ecosystem"
                        description="The Focus Timer, Win Jar, and streak tracking are live to help you build momentum."
                        completed
                    />
                    <Feature 
                        icon={<CheckCircle />}
                        title="Cross-Platform Integration"
                        description="A lightweight Google Chrome Extension and a backend for Slack slash commands have been built."
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
                        Phase 6: In Progress
                    </CardTitle>
                     <CardDescription>Public presence and core integrations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Feature 
                        icon={<CircleDashed />}
                        title="Google Suite Integration"
                        description="Enable syncing with Google Calendar and Google Tasks, plus importing from Google Keep/Docs."
                    />
                     <Feature 
                        icon={<CircleDashed />}
                        title="Public-Facing Website"
                        description="Building out the About, Roadmap, and Blog sections to share our story and progress."
                    />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Bot className="text-primary"/>
                        Phase 7: Future Enhancements
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

        </div>
    );
}
