import PublicLayout from '@/components/layout/public-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const phases = [
    {
        name: "Phase 1: Foundation & Core Setup",
        status: "complete",
        description: "Establish the basic application structure, user authentication, and core UI shell.",
        features: ["Project Initialization", "User Authentication (Google)", "Basic UI Layout", "Firebase Integration"]
    },
    {
        name: "Phase 2: Task Jar & Initial AI Integration",
        status: "complete",
        description: "Implement the core Task Jar functionality, including AI processing and weighted selection.",
        features: ["'Brain Dump' Input", "AI Task Categorization", "Task Persistence", "Weighted Random Selection"]
    },
    {
        name: "Phase 3: Motivation, Gratitude & Intention Setter",
        status: "complete",
        description: "Implement the remaining core 'jar' features and the AI-powered intention setter.",
        features: ["Motivation Jar (Random Affirmations)", "Gratitude Jar (Entry & Rating)", "AI Intention Setter"]
    },
    {
        name: "Phase 4: Growth Ecosystem",
        status: "complete",
        description: "Integrate the 'count-up' focus timer, 'Win' Jar, and streak tracking.",
        features: ["'Count-Up' Focus Timer", "'Win' Jar", "Streak & Personal Record Tracking"]
    },
    {
        name: "Phase 5: Cross-Platform Integration & Polish",
        status: "in-progress",
        description: "Extend ZenJar to other platforms and refine the user experience.",
        features: ["Google Chrome Extension", "Slack Bot Integration", "UI/UX Refinements & Polish"]
    },
    {
        name: "Phase 6: Public Presence & Advanced Integrations",
        status: "next",
        description: "Establish ZenJar's public-facing website and implement deeper integrations.",
        features: ["Public About & Roadmap Pages", "Google Calendar/Tasks Integration", "Blog Setup"]
    },
    {
        name: "Phase 7: Advanced Features & Future Enhancements",
        status: "next",
        description: "Continuous improvement and expansion of ZenJar's capabilities.",
        features: ["Pro Tier Features (Growth Dashboard, Custom Jars)", "Shared Jars (Collaboration)", "Voice Control (ZenSpeak)"]
    }
]

const statusIcons = {
    complete: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    "in-progress": <Clock className="h-5 w-5 text-blue-500 animate-pulse" />,
    next: <Circle className="h-5 w-5 text-muted-foreground" />
}

export default function RoadmapPage() {
  return (
    <PublicLayout>
      <div className="container max-w-4xl py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
            Our Development Roadmap
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            We believe in building in public. Here's a look at what we've accomplished and where we're headed.
          </p>
        </header>
        <div className="space-y-8">
          {phases.map((phase) => (
            <Card key={phase.name} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
                <CardTitle className="font-headline text-lg flex items-center gap-3">
                    {statusIcons[phase.status as keyof typeof statusIcons]}
                    {phase.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">{phase.description}</p>
                <div className="flex flex-wrap gap-2">
                    {phase.features.map(feature => (
                        <Badge key={feature} variant="secondary">{feature}</Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
