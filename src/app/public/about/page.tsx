import PublicLayout from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter font-headline sm:text-5xl">About ZenJar</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              An AI-powered sanctuary for focus, gratitude, and motivation.
            </p>
          </header>

          <div className="prose prose-lg dark:prose-invert mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Our Philosophy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  In a world of overwhelming to-do lists and constant distractions, ZenJar was conceived to combat digital fatigue and foster mindfulness. Traditional productivity tools often focus on deadlines and "counting down," which can induce stress. ZenJar flips this script by embracing a "count-up" philosophy, turning focus and achievements into tangible, growing assets. Its uniqueness lies in its simple, satisfying "jar" metaphor, combined with intelligent AI that automates organization and provides supportive insights.
                </p>
              </CardContent>
            </Card>

            <h2 className="font-headline">The Jar Metaphor</h2>
            <p>
              Each "jar" in the application is a dedicated space for a different aspect of your well-being and productivity.
            </p>
            <ul>
              <li><strong>The Task Jar:</strong> A place to offload your mental clutter. Our AI helps you make sense of it all by categorizing and prioritizing your tasks, allowing you to focus on what's important.</li>
              <li><strong>The Motivation Jar:</strong> A source of inspiration when you need it most. Draw an affirmation or quote to overcome procrastination and find your drive.</li>
              <li><strong>The Gratitude Jar:</strong> A space to cultivate a positive mindset. By recording moments of gratitude, you create a persistent reminder of the good things in your life.</li>
              <li><strong>The Win Jar:</strong> Celebrate your accomplishments, big and small. Paired with our "count-up" focus timer, this system helps you build momentum and recognize your progress.</li>
            </ul>

            <h2 className="font-headline">Our Approach to AI</h2>
            <p>
              We believe AI should be a supportive partner, not an intrusive manager. ZenJar uses AI to reduce friction and provide gentle guidance. From parsing your "brain dumps" into actionable tasks to providing personalized encouragement, our AI is designed to work quietly in the background, helping you find clarity and build confidence without adding to the noise.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
