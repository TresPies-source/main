import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline text-primary">
                        About ZenJar
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
                        A minimalist sanctuary for focus, gratitude, and motivation in a distracted world.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Our Philosophy: The "Count-Up" Approach</CardTitle>
                        </CardHeader>
                        <CardContent className="text-lg text-foreground/80 space-y-4">
                            <p>
                                In a world of overwhelming to-do lists and constant distractions, ZenJar was conceived to combat digital fatigue and foster mindfulness. Traditional productivity tools often focus on deadlines and "counting down," which can induce stress.
                            </p>
                            <p>
                                ZenJar flips this script by embracing a <strong className="text-primary">"count-up" philosophy</strong>, turning focus and achievements into tangible, growing assets. Its uniqueness lies in its simple, satisfying "jar" metaphor, combined with intelligent AI that automates organization and provides supportive insights.
                            </p>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Our Mission & Vision</CardTitle>
                        </CardHeader>
                        <CardContent className="text-lg text-foreground/80 space-y-4">
                           <p>
                            Our mission is to provide a calm, intuitive space that helps you cut through the noise, organize your thoughts, and build a positive feedback loop of accomplishment and self-awareness. We envision a world where technology serves our well-being, rather than detracting from it.
                           </p>
                        </CardContent>
                    </Card>
                    
                    <div className="text-center pt-8">
                        <Button asChild size="lg">
                            <Link href="/">Return to the App</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
