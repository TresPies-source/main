import PublicLayout from '@/components/layout/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl">
              About ZenJar
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              A minimalist wellness and productivity tool to combat digital fatigue and foster mindfulness.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Our Philosophy: The "Count-Up" Approach</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-stone dark:prose-invert max-w-none">
              <p>
                In a world of overwhelming to-do lists and constant distractions, ZenJar was conceived to combat digital fatigue. Traditional productivity tools often focus on deadlines and "counting down," which can induce stress.
              </p>
              <p>
                ZenJar flips this script by embracing a "count-up" philosophy, turning focus and achievements into tangible, growing assets. Its uniqueness lies in its simple, satisfying "jar" metaphor, combined with intelligent AI that automates organization and provides supportive insights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Core Features</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-stone dark:prose-invert max-w-none">
              <ul>
                <li><strong>AI-Powered Task Jar:</strong> Brain-dump your tasks and let our AI categorize and prioritize them for you.</li>
                <li><strong>Motivation Jar:</strong> Draw from a curated collection of affirmations and quotes to overcome procrastination.</li>
                <li><strong>Gratitude Jar:</strong> Record things you're grateful for and watch your jar fill up, with visual weighting for higher-rated items.</li>
                <li><strong>Focus Timer & Win Jar:</strong> Measure your focus with our unique "count-up" timer and log your daily accomplishments.</li>
                <li><strong>AI Intention Setter:</strong> Set your daily goal and receive a supportive, personalized response from our AI.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
