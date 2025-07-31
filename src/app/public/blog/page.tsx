import PublicLayout from "@/components/layout/public-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Mock blog posts for now
const posts = [
  {
    slug: "welcome-to-zenjar",
    title: "Welcome to ZenJar: A New Approach to Productivity",
    description: "Learn about the philosophy behind ZenJar and how it can help you find calm and focus in a busy world.",
    date: "October 26, 2023",
  },
  {
    slug: "the-power-of-the-win-jar",
    title: "The Power of the Win Jar: Building Confidence Daily",
    description: "Discover how celebrating small victories can lead to big changes in your motivation and self-esteem.",
    date: "October 24, 2023",
  }
];


export default function BlogPage() {
  return (
    <PublicLayout>
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-4xl font-bold font-headline">ZenJar Blog</h1>
                <p className="text-muted-foreground text-lg mt-2">Insights on productivity, mindfulness, and getting the most out of ZenJar.</p>
            </header>
            <div className="space-y-6">
                {posts.map((post) => (
                    <Card key={post.slug} className="hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">
                                <Link href={`/public/blog/${post.slug}`} className="hover:underline">
                                    {post.title}
                                </Link>
                            </CardTitle>
                            <CardDescription>{post.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{post.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </PublicLayout>
  );
}
