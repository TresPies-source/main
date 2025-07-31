import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/main-layout";
import Link from "next/link";

export default function AboutPage() {
    return (
        <MainLayout title="About ZenJar">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-4xl font-headline">
                            Our Mission: Calm Clarity in a Hectic World
                        </CardTitle>
                        <CardDescription className="text-lg pt-2">
                            ZenJar is a minimalist wellness and productivity tool designed to combat digital fatigue and foster mindfulness.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-base">
                        <p>
                            In a world of overwhelming to-do lists and constant distractions, we believe technology should serve, not stress. Traditional productivity tools often focus on deadlines and "counting down," which can induce anxiety. ZenJar flips this script.
                        </p>
                        <p>
                            We embrace a <strong className="font-semibold text-primary">"count-up" philosophy</strong>, turning focus and achievements into tangible, growing assets. Our unique "jar" metaphor, combined with intelligent AI, helps you automate organization, find motivation, and practice gratitude, all within a serene digital space.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">The ZenJar Philosophy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            <strong>Simplicity & Focus:</strong> A clean, uncluttered interface to minimize distractions and help you concentrate on what truly matters.
                        </p>
                        <p>
                            <strong>Mindful Productivity:</strong> We encourage a gentle, reflective approach to getting things done, valuing well-being over sheer output.
                        </p>
                        <p>
                           <strong>AI as a Supportive Partner:</strong> Our AI is designed to be a helpful assistant that reduces mental load, not a demanding taskmaster.
                        </p>
                    </CardContent>
                </Card>

                 <Card>
                  <CardHeader>
                    <CardTitle>Development Roadmap</CardTitle>
                    <CardDescription>
                      Follow our journey and see what's next for ZenJar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/public/roadmap">View Our Roadmap</Link>
                    </Button>
                  </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}