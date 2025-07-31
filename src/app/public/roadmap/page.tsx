import PublicLayout from "@/components/layout/public-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

const roadmapPhases = [
  {
    title: "Phase 1: Foundation & Core Setup",
    status: "Completed",
    description: "Establish the basic application structure, user authentication, and core UI shell.",
    features: [
      "Project Initialization",
      "User Authentication (Google)",
      "Basic UI Layout & Navigation",
      "Firebase Integration",
    ],
  },
  {
    title: "Phase 2: Task Jar & Initial AI Integration",
    status: "Completed",
    description: "Implement the core Task Jar functionality, including AI processing and weighted selection.",
    features: [
      "AI-Powered Task Categorization",
      "Task Persistence (Firestore)",
      "Weighted Random Task Selection",
      "\"Empty Jar\" Functionality",
    ],
  },
  {
    title: "Phase 3: Motivation, Gratitude & Intention Setter",
    status: "Completed",
    description: "Implement the remaining core \"jar\" features and the AI-powered intention setter.",
    features: [
      "Motivation Jar",
      "Gratitude Jar with Persistence",
      "AI-Powered Intention Setter",
    ],
  },
   {
    title: "Phase 4: Growth Ecosystem",
    status: "Completed",
    description: "Integrate the \"count-up\" focus timer, \"Win\" Jar, and streak tracking.",
    features: [
        "\"Count-Up\" Focus Timer with Persistence",
        "\"Win\" Jar for Accomplishments",
        "Dynamic Streaks & Personal Records",
    ],
  },
  {
    title: "Phase 5: Public Presence",
    status: "In Progress",
    description: "Establish ZenJar's public-facing website and content.",
     features: [
        "Settings Page Enhancements",
        "Public \"About Us\" Page",
        "Public Development Roadmap",
        "Blog Structure Setup",
    ],
  },
  {
    title: "Phase 6: Advanced Features & Integrations",
    status: "Planned",
    description: "Introduce Pro-tier features and connect ZenJar with other services.",
    features: [
        "Freemium Model & Pro Subscription",
        "Google Suite Integrations (Calendar, Tasks)",
        "Growth Dashboard (Pro)",
        "AI-Powered Insights (Pro)",
    ],
  },
    {
    title: "Phase 7: Cross-Platform & Voice",
    status: "Planned",
    description: "Expand ZenJar's accessibility to other platforms and introduce voice commands.",
    features: [
        "Google Chrome Extension",
        "Slack & Discord Bots",
        "Voice Control (ZenSpeak)",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <PublicLayout>
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Development Roadmap</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Follow along with our progress as we build ZenJar.
          </p>
        </div>

        <div className="space-y-8">
          {roadmapPhases.map((phase, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="font-headline text-xl">{phase.title}</CardTitle>
                    <Badge variant={phase.status === 'Completed' ? 'default' : phase.status === 'In Progress' ? 'secondary' : 'outline'}>
                        {phase.status}
                    </Badge>
                </div>
                <CardDescription>{phase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                    {phase.features.map(feature => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}