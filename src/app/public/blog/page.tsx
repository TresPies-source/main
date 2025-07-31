import PublicLayout from "@/components/layout/public-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Placeholder blog posts data
const posts = [
  {
    slug: "welcome-to-zenjar",
    title: "Welcome to ZenJar: A New Approach to Mindful Productivity",
    excerpt: "Learn about the philosophy behind ZenJar and how our unique 'count-up' approach can help you find focus and reduce stress in a world of digital fatigue.",
    date: "October 26, 2023",
  },
  {
    slug: "the-power-of-the-win-jar",
    title: "The Power of the 'Win' Jar: Celebrating Your Daily Accomplishments",
    excerpt: "Discover why tracking your small victories is just as important as managing your big tasks and how it can build momentum and confidence over time.",
    date: "October 28, 2023",
  },
    {
    slug: "beyond-the-todo-list",
    title: "Beyond the To-Do List: Using AI to Declutter Your Mind",
    excerpt: "Explore how ZenJar's AI-powered 'Brain Dump' helps you offload your mental checklist, categorize tasks, and focus on what truly matters without the overwhelm.",
    date: "November 2, 2023",
  },
];

export default function BlogPage() {
  return (
    <PublicLayout>
        <section className="container py-12 md:py-16">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">The ZenJar Blog</h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
                    Insights on productivity, mindfulness, and getting the most out of ZenJar.
                </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Card key={post.slug} className="flex flex-col">
                        <CardHeader>
                            <span className="text-sm text-muted-foreground">{post.date}</span>
                            <CardTitle className="font-headline text-xl mt-1">
                                <Link href={`/public/blog/${post.slug}`} className="hover:text-primary transition-colors">
                                    {post.title}
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground">{post.excerpt}</p>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button asChild variant="link" className="p-0 h-auto">
                                <Link href={`/public/blog/${post.slug}`}>
                                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    </PublicLayout>
  );
}
