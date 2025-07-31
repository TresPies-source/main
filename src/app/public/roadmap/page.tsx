import path from 'path';
import fs from 'fs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/main-layout";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


const comprehensiveProjectDocument = fs.readFileSync(path.join(process.cwd(), 'internal/comprehensiveprojectdocument.md'), 'utf8');
const wireframeDocument = fs.readFileSync(path.join(process.cwd(), 'internal/wireframe.md'), 'utf8');


const phases = [
    {
      name: "Phase 1: Foundation & Core Setup",
      description: "Establish the basic application structure, user authentication, and core UI shell.",
      status: "completed",
    },
    {
      name: "Phase 2: Task Jar & Initial AI Integration",
      description: "Implement the core Task Jar functionality, including AI processing and weighted selection.",
      status: "completed",
    },
    {
      name: "Phase 3: Motivation, Gratitude & Intention Setter",
      description: "Implement the remaining core 'jar' features and the AI-powered intention setter.",
      status: "completed",
    },
    {
        name: "Phase 4: Growth Ecosystem & Monetization",
        description: "Integrate the 'count-up' focus timer, 'Win' Jar, streak tracking, and implement the freemium model.",
        status: "active",
    },
    {
      name: "Phase 5: Cross-Platform Integration & Polish",
      description: "Extend ZenJar to other platforms and refine the user experience.",
      status: "pending",
    },
    {
        name: "Phase 6: Public Presence & Core Integrations",
        description: "Establish ZenJar's public-facing website and implement initial Google Suite integrations.",
        status: "pending",
    },
    {
        name: "Phase 7: Advanced Integrations & Future Enhancements",
        description: "Continuous improvement, expansion of integrations, and preparation for advanced AI agent collaboration.",
        status: "pending",
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "active":
        return "bg-blue-500";
      case "pending":
      default:
        return "bg-gray-400";
    }
  };
  
export default function RoadmapPage() {
    return (
      <MainLayout title="Development Roadmap">
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                    <div className="absolute left-1/2 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                    {phases.map((phase, index) => (
                        <div key={index} className="relative mb-8">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className={`h-4 w-4 rounded-full ${getStatusClass(phase.status)}`}></div>
                        </div>
                        <div className={`w-[calc(50%-1rem)] p-4 rounded-lg bg-card shadow-md ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                            <h3 className="font-bold">{phase.name}</h3>
                            <p className="text-sm text-muted-foreground">{phase.description}</p>
                        </div>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full space-y-6">
              <AccordionItem value="item-1" className="border-none">
                <Card>
                  <AccordionTrigger className="p-6 hover:no-underline">
                      <CardTitle>Comprehensive Project Document</CardTitle>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {comprehensiveProjectDocument}
                            </ReactMarkdown>
                        </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-none">
                <Card>
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <CardTitle>Wireframe Document</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {wireframeDocument}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                    </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
        </div>
      </MainLayout>
    );
  }
  
