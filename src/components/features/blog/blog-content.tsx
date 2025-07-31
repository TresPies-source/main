'use client';

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Rss } from "lucide-react";

export function BlogContent() {
    return (
        <div className="max-w-4xl mx-auto text-center">
            <Rss className="h-12 w-12 mx-auto text-muted-foreground" />
            <h1 className="font-headline text-4xl mt-4">ZenJar Blog</h1>
            <p className="text-lg mt-2 text-muted-foreground">
                Coming soon.
            </p>
            <Card className="mt-8 text-left">
                <CardHeader>
                    <CardTitle>Stay Tuned!</CardTitle>
                    <CardDescription>
                        We're working on articles about productivity, mindfulness, and how to get the most out of ZenJar. Check back soon for updates and insights!
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
