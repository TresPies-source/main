import PublicLayout from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight font-headline">
              About ZenJar
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A minimalist, multi-platform wellness and productivity tool for calm clarity.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none text-card-foreground">
              <p>
                In a world of overwhelming to-do lists and constant distractions, ZenJar was conceived to combat digital fatigue and foster mindfulness. Traditional productivity tools often focus on deadlines and "counting down," which can induce stress. ZenJar flips this script by embracing a "count-up" philosophy, turning focus and achievements into tangible, growing assets.
              </p>
              <p>
                Our mission is to provide a simple, satisfying, and intelligent tool that helps you organize your mind, find motivation, practice gratitude, and build confidence, one entry at a time.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">The ZenJar Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">The "Jar" Metaphor</h3>
                        <p className="text-muted-foreground">
                            Each "jar" is a dedicated space for a specific aspect of your life—Tasks, Motivation, and Gratitude. This separation helps bring clarity and focus to your thoughts and intentions.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">The "Count-Up" Approach</h3>
                        <p className="text-muted-foreground">
                            Instead of counting down to deadlines, we count up your achievements. Our Focus Timer measures sustained concentration, and the "Win" Jar celebrates your accomplishments, fostering a sense of growth and momentum.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">AI-Powered Simplicity</h3>
                        <p className="text-muted-foreground">
                            We leverage AI not to complicate, but to simplify. From categorizing your "brain dump" of tasks to providing a gentle nudge of encouragement, our AI works in the background to make your life easier, not more complex.
                        </p>
                    </div>
                </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </PublicLayout>
  );
}
