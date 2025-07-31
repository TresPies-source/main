import { PublicHeader } from "@/components/layout/public-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// In a real app, this would come from a CMS or a database.
const posts: { [key: string]: any } = {
  "big-updates-and-a-solid-foundation": {
    slug: "big-updates-and-a-solid-foundation",
    title: "Big Updates and a Solid Foundation",
    date: "July 26, 2024",
    author: "The ZenJar Team",
    tags: ["Update", "Security", "Performance"],
    image: {
      src: "https://placehold.co/1200x600.png",
      alt: "Abstract image representing stability and growth",
      aiHint: "stability growth"
    },
    content: `
<p class="lead">We've been incredibly busy laying a rock-solid foundation for ZenJar. While it might not be a flashy new feature, this recent development cycle was one of the most important in our journey. We've focused on making the app faster, more reliable, and significantly more secure. Here's a breakdown of what's new under the hood.</p>

<h3>Hardened Security</h3>
<p>Your data and privacy are paramount. We've implemented comprehensive Firestore Security Rules, ensuring that each user has exclusive access to their own data. On top of that, we've enabled Firebase App Check enforcement, which means only genuine requests from our official app can interact with the backend, protecting against abuse and unauthorized access.</p>

<h3>Blazing Fast Performance</h3>
<p>You should feel a significant difference in how snappy the app is. We've implemented dynamic loading and code-splitting across all major pages. Now, when you navigate the app, you'll see a near-instant-loading skeleton of the page while the main content loads seamlessly in the background. This makes for a much smoother and more pleasant experience.</p>

<h3>Core Integrations Activated</h3>
<p>We've moved beyond placeholders! You can now actively use our Google integrations:</p>
<ul>
    <li><strong>Google Doc Import:</strong> Seamlessly import your brain dumps and task lists directly from Google Docs into the Task Jar.</li>
    <li><strong>Google Calendar & Tasks:</strong> Create calendar events from drawn tasks and sync your entire task list with Google Tasks to keep your digital life in harmony.</li>
</ul>

<h3>What's Next?</h3>
<p>With this solid foundation in place, we're now full steam ahead on building out the premium "Pro" features you've been seeing placeholders for. Get ready for the Growth Dashboard, AI-powered sub-tasks, and much more.</p>
<p>Thank you for being on this journey with us. Your feedback has been invaluable, and we're excited to continue building a tool that genuinely helps bring calm and focus to your day.</p>
`
  }
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        <article className="container max-w-3xl py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="ghost" className="pl-0">
                    <Link href="/public/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to all posts
                    </Link>
                </Button>
            </div>
          <header className="mb-8">
             <div className="flex flex-wrap gap-2 mb-2">
                {post.tags.map((tag:string) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
            <h1 className="font-headline text-4xl md:text-5xl leading-tight mb-4">{post.title}</h1>
            <p className="text-muted-foreground">{post.date} by {post.author}</p>
          </header>
          
          <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden border">
             <Image 
                src={post.image.src} 
                alt={post.image.alt} 
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={post.image.aiHint}
            />
          </div>

          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

        </article>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                Built with ZenJar. The source code is available on GitHub.
            </p>
        </div>
      </footer>
    </div>
  );
}
