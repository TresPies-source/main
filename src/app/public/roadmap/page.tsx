
import MainLayout from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Circle, Milestone, GitCommit } from "lucide-react";
import * as fs from 'fs/promises';
import { join } from 'path';

async function getMarkdownContent(fileName: string) {
    try {
        const filePath = join(process.cwd(), 'internal', fileName);
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error);
        return `Could not load content for ${fileName}.`;
    }
}

const phases = [
  {
    title: "Phase 1: Foundation & Core Setup",
    objective:
      "Establish the basic application structure, user authentication, and core UI shell.",
    status: "completed",
  },
  {
    title: "Phase 2: Task Jar & Initial AI Integration",
    objective:
      "Implement the core Task Jar functionality, including AI processing and weighted selection.",
    status: "in-progress",
  },
  {
    title: "Phase 3: Motivation, Gratitude & Intention Setter",
    objective:
      "Implement the remaining core 'jar' features and the AI-powered intention setter.",
    status: "todo",
  },
  {
    title: "Phase 4: Growth Ecosystem & Monetization",
    objective:
      "Integrate the 'count-up' focus timer, 'Win' Jar, streak tracking, and implement the freemium model.",
    status: "todo",
  },
  {
    title: "Phase 5: Cross-Platform Integration & Polish",
    objective: "Extend ZenJar to other platforms and refine the user experience.",
    status: "todo",
  },
  {
    title: "Phase 6: Public Presence & Core Integrations",
    objective:
      "Establish ZenJar's public-facing website and implement initial Google Suite integrations.",
    status: "todo",
  },
  {
    title: "Phase 7: Advanced Integrations & Future Enhancements",
    objective: "Continuous improvement, expansion of integrations, and preparation for advanced AI agent collaboration.",
    status: "todo",
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "completed") {
    return <CheckCircle className="h-6 w-6 text-green-500" />;
  }
  if (status === "in-progress") {
    return <GitCommit className="h-6 w-6 text-blue-500 animate-pulse" />;
  }
  return <Circle className="h-6 w-6 text-muted-foreground" />;
};

export default async function RoadmapPage() {
  const comprehensiveDoc = await getMarkdownContent('comprehensiveprojectdocument.md');
  const wireframeDoc = await getMarkdownContent('wireframe.md');

  return (
    <MainLayout title="Development Roadmap">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
                <Milestone />
                Our Development Journey
            </CardTitle>
            <CardDescription>
              Follow along with our development journey. Here's our plan for bringing ZenJar to life.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {phases.map((phase, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <StatusIcon status={phase.status} />
                    {index < phases.length - 1 && (
                      <div className="w-px h-full bg-border flex-1 my-2"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold font-headline text-lg">{phase.title}</h3>
                    <p className="text-muted-foreground">{phase.objective}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
            <Card>
                 <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="p-6 text-xl font-headline hover:no-underline">
                        Comprehensive Project Document
                    </AccordionTrigger>
                    <AccordionContent className="px-6">
                        <pre className="whitespace-pre-wrap font-body text-sm bg-secondary/30 p-4 rounded-md">{comprehensiveDoc}</pre>
                    </AccordionContent>
                </AccordionItem>
            </Card>

            <Card>
                <AccordionItem value="item-2" className="border-b-0">
                    <AccordionTrigger className="p-6 text-xl font-headline hover:no-underline">
                        Application Wireframe Document
                    </AccordionTrigger>
                    <AccordionContent className="px-6">
                        <pre className="whitespace-pre-wrap font-body text-sm bg-secondary/30 p-4 rounded-md">{wireframeDoc}</pre>
                    </AccordionContent>
                </AccordionItem>
            </Card>
        </Accordion>
      </div>
    </MainLayout>
  );
}
