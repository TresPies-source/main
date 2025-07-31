"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Star, Zap } from "lucide-react";

export function AboutContent() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <BrainCircuit className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-4xl mt-4">The ZenJar Philosophy</CardTitle>
                    <CardDescription className="text-lg max-w-2xl mx-auto">
                        In a world of digital fatigue and overwhelming to-do lists, ZenJar is your sanctuary for calm clarity and mindful productivity.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-base text-foreground/80 space-y-4">
                    <p>Traditional productivity tools often amplify stress with deadlines and countdowns. We believe in a different approach—a "count-up" philosophy. ZenJar is designed to help you build momentum, celebrate small wins, and cultivate a positive mindset through simple, powerful, and AI-enhanced "Jars."</p>
                    <p>Our mission is to help you reduce anxiety, find focus, practice gratitude, and build genuine confidence. It's not about doing more; it's about doing what matters with intention and peace.</p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 text-center">
                <Card>
                    <CardHeader>
                        <Zap className="h-8 w-8 mx-auto text-accent" />
                        <CardTitle className="font-headline text-xl mt-2">AI-Powered Clarity</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Let our AI handle the organization. Brain dump your tasks, and we'll categorize and prioritize them, so you can focus on what's next.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Star className="h-8 w-8 mx-auto text-accent" />
                        <CardTitle className="font-headline text-xl mt-2">Growth Ecosystem</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Measure your focus with our unique count-up timer, log your accomplishments in the Win Jar, and watch your confidence grow.
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <BrainCircuit className="h-8 w-8 mx-auto text-accent" />
                        <CardTitle className="font-headline text-xl mt-2">Mindful Jars</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                       From a Motivation Jar for instant encouragement to a Gratitude Jar for reflection, ZenJar provides tools for a balanced mind.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
