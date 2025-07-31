// @ts-nocheck
'use client'
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, Building, TestTube2, Sprout, Handshake } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import comprehensiveProjectDocument from "!!raw-loader!@/internal/comprehensiveprojectdocument.md";
import wireframeDocument from "!!raw-loader!@/internal/wireframe.md";

const phases = [
  { name: "Phase 1: Foundation & Core Setup", status: "completed", icon: Building },
  { name: "Phase 2: Task Jar & Initial AI Integration", status: "in_progress", icon: TestTube2 },
  { name: "Phase 3: Motivation, Gratitude & Intention Setter", status: "todo", icon: Sprout },
  { name: "Phase 4: Growth Ecosystem & Monetization", status: "todo", icon: Zap },
  { name: "Phase 5: Cross-Platform Integration & Polish", status: "todo", icon: Handshake },
  { name: "Phase 6: Public Presence & Core Integrations", status: "todo", icon: Handshake },
  { name: "Phase 7: Advanced Integrations & Future Enhancements", status: "todo", icon: Zap },
];

export default function RoadmapPage() {
  return (
    <MainLayout title="Development Roadmap">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Project Phases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div
                className="absolute left-4 top-4 h-full w-0.5 bg-border"
                aria-hidden="true"
              />
              <ul className="space-y-8">
                {phases.map((phase, index) => (
                  <li key={index} className="relative flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${phase.status === 'completed' ? 'bg-primary' : 'bg-accent'} text-primary-foreground`}>
                        <phase.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold">{phase.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {phase.status === "completed"
                          ? "Completed"
                          : phase.status === "in_progress"
                          ? "In Progress"
                          : "Planned"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Project Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none prose-headings:font-headline prose-a:text-primary hover:prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {comprehensiveProjectDocument}
                </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wireframe Document</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="prose prose-sm max-w-none prose-headings:font-headline prose-a:text-primary hover:prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {wireframeDocument}
                </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
