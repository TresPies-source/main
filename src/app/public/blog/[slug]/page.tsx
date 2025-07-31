import PublicLayout from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

// Placeholder content - In a real app, this would be fetched from a CMS
const getPostContent = (slug: string) => {
    const posts: {[key: string]: any} = {
        'welcome-to-zenjar': {
            title: "Welcome to ZenJar: A New Approach to Mindful Productivity",
            date: "October 26, 2023",
            author: "The ZenJar Team",
            tags: ["Productivity", "Mindfulness", "Launch"],
            image: "https://placehold.co/1200x600.png",
            imageHint: "serene desk",
            content: `
<p>In a world of overwhelming to-do lists and constant digital noise, it's easy to feel like you're always playing catch-up. Traditional productivity tools often contribute to this stress with their focus on deadlines and "counting down." At ZenJar, we believe in a different approach.</p>
<p>We're flipping the script by embracing a "count-up" philosophy. Instead of focusing on what's left to do, we celebrate the focus and effort you've already invested. ZenJar is a minimalist wellness and productivity tool designed to combat digital fatigue and foster mindfulness.</p>
<h2 class="text-2xl font-bold mt-8 mb-4">The Jar Metaphor</h2>
<p>Our core concept is simple: "Jars." You have a Task Jar for your to-dos, a Gratitude Jar for moments of thankfulness, and a Win Jar to log your accomplishments. This simple, satisfying metaphor, combined with intelligent AI, helps you organize your thoughts, find motivation, and build confidence.</p>
<p>Thank you for joining us on this journey. We're excited to help you find your focus and cultivate a more mindful relationship with your work and life.</p>
            `,
        },
        'the-power-of-the-win-jar': {
            title: "The Power of the 'Win' Jar: Celebrating Your Daily Accomplishments",
            date: "October 28, 2023",
            author: "The ZenJar Team",
            tags: ["Productivity", "Motivation"],
            image: "https://placehold.co/1200x600.png",
            imageHint: "trophy celebration",
            content: `
<p>It’s easy to move from one task to the next without acknowledging our progress. The "Win Jar" is designed to change that. It's a dedicated space to quickly record your daily or weekly accomplishments, no matter how small.</p>
<p>Logging a "win" after a focus session or whenever you complete something meaningful creates a powerful feedback loop. It builds momentum and reinforces the positive habit of recognizing your own efforts. Over time, this collection of wins becomes a testament to your hard work and resilience.</p>
<h2 class="text-2xl font-bold mt-8 mb-4">Why It Works</h2>
<p>Psychologically, acknowledging small wins releases dopamine, a neurotransmitter associated with pleasure and motivation. By consciously logging your wins, you're training your brain to associate progress with positive feelings, making it easier to tackle future challenges. Start filling your Win Jar today and see the difference it makes.</p>
            `,
        },
         'beyond-the-todo-list': {
            title: "Beyond the To-Do List: Using AI to Declutter Your Mind",
            date: "November 2, 2023",
            author: "The ZenJar Team",
            tags: ["AI", "Productivity"],
            image: "https://placehold.co/1200x600.png",
            imageHint: "organized thoughts",
            content: `
<p>The mental load of remembering every little task can be exhausting. ZenJar's "Brain Dump" feature is designed to alleviate that pressure. Simply type out everything on your mind—big projects, small errands, random ideas—and let our AI do the heavy lifting.</p>
<p>The AI flow processes your unstructured text, automatically splitting it into individual tasks, assigning a priority level, and suggesting a category. This transforms a chaotic stream of consciousness into an organized, actionable list in seconds.</p>
<h2 class="text-2xl font-bold mt-8 mb-4">Focus on Doing, Not Organizing</h2>
<p>By offloading the mental work of organization, you free up cognitive resources to focus on execution. The AI isn't here to replace your judgment, but to serve as a powerful assistant that clears the path for you to do your best work. Give the Brain Dump a try and experience the clarity of a decluttered mind.</p>
            `,
        }
    };
    return posts[slug] || null;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = getPostContent(params.slug);

    if (!post) {
        return (
            <PublicLayout>
                <div className="container py-12 text-center">
                    <h1 className="text-4xl font-bold">Post not found</h1>
                    <p className="mt-4 text-muted-foreground">Sorry, we couldn't find the blog post you're looking for.</p>
                    <Button asChild className="mt-6">
                        <Link href="/public/blog">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Blog
                        </Link>
                    </Button>
                </div>
            </PublicLayout>
        )
    }

    return (
        <PublicLayout>
            <article className="container max-w-4xl py-12">
                <div className="mb-8">
                    <Link href="/public/blog" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to all posts
                    </Link>
                </div>
                
                <h1 className="text-4xl font-bold leading-tight font-headline md:text-5xl">{post.title}</h1>

                <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>By {post.author}</span>
                    <span>&middot;</span>
                    <span>{post.date}</span>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>

                <div className="my-8 relative aspect-video">
                    <Image 
                        src={post.image}
                        alt={post.title}
                        fill
                        className="rounded-lg object-cover"
                        data-ai-hint={post.imageHint}
                    />
                </div>
                
                <div 
                    className="prose dark:prose-invert max-w-none text-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

            </article>
        </PublicLayout>
    );
}
