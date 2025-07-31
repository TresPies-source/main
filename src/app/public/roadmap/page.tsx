import { promises as fs } from 'fs';
import path from 'path';
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const phases = [
    { name: "Foundation & Core Setup", status: "completed" },
    { name: "Task Jar & Initial AI", status: "completed" },
    { name: "Motivation, Gratitude & Intention", status: "completed" },
    { name: "Growth Ecosystem", status: "in_progress" },
    { name: "Cross-Platform Integration", status: "planned" },
    { name: "Public Presence & Core Integrations", status: "planned" },
    { name: "Advanced Features & Future Enhancements", status: "planned" },
];

export default async function RoadmapPage() {
    const markdownStyles = "prose dark:prose-invert max-w-none p-4 bg-secondary/30 rounded-lg";
    
    // Read the markdown files from the file system
    const comprehensiveProjectDocumentPath = path.join(process.cwd(), 'internal/comprehensiveprojectdocument.md');
    const wireframeDocumentPath = path.join(process.cwd(), 'internal/wireframe.md');
    
    const comprehensiveProjectDocument = await fs.readFile(comprehensiveProjectDocumentPath, 'utf8');
    const wireframeDocument = await fs.readFile(wireframeDocumentPath, 'utf8');

    return (
        <MainLayout title="Development Roadmap">
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">ZenJar Development Roadmap</CardTitle>
                        <CardDescription>
                            A transparent look at our journey, from initial concept to future enhancements.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
                            {phases.map((phase, index) => (
                                <div key={index} className="relative mb-8 pl-8">
                                    <div className={`absolute -left-3 top-1.5 h-6 w-6 rounded-full flex items-center justify-center ${phase.status === 'completed' ? 'bg-green-500' : 'bg-muted-foreground'}`}>
                                        {phase.status === 'completed' && <CheckCircle className="h-4 w-4 text-white" />}
                                    </div>
                                    <h3 className="font-semibold text-lg">{phase.name}</h3>
                                    <p className="text-sm text-muted-foreground">Phase {index + 1}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Comprehensive Project Document</CardTitle>
                        <CardDescription>The complete design and architecture of ZenJar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ReactMarkdown className={markdownStyles} remarkPlugins={[remarkGfm]}>{comprehensiveProjectDocument}</ReactMarkdown>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Wireframe Document</CardTitle>
                        <CardDescription>The visual blueprint for the ZenJar application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ReactMarkdown className={markdownStyles} remarkPlugins={[remarkGfm]}>{wireframeDocument}</ReactMarkdown>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}