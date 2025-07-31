'use client';

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const postData = {
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
<p>We've been hard at work solidifying ZenJar's foundation to ensure it's not just a powerful tool for mindfulness and productivity, but also a secure and reliable one. This update is all about the crucial behind-the-scenes work that paves the way for the exciting new features on our roadmap.</p>

<h3 class="font-headline text-2xl mt-8 mb-4">Strengthened Security with Firebase App Check</h3>
<p>Your data privacy and security are paramount. We've fully integrated Firebase App Check with reCAPTCHA v3 across our application. This means that every request made from the ZenJar app to our backend is now verified, protecting against threats like billing fraud and phishing by ensuring that all traffic comes from your legitimate app instance and not from an unauthorized client.</p>
<p>We initially encountered a 500 Internal Server Error during the rollout, which we traced back to a missing reCAPTCHA secret key in our Firebase project settings. This has now been resolved, and App Check is fully operational, providing a robust layer of security for your account and data.</p>

<h3 class="font-headline text-2xl mt-8 mb-4">Enhanced Performance and Reliability</h3>
<p>In addition to security, we've focused on making the ZenJar experience smoother and more reliable. We've fine-tuned our backend services and optimized data handling to improve response times and overall app performance. These changes ensure that whether you're adding a task, logging a win, or drawing a motivation quote, the experience is seamless and fast.</p>

<h3 class="font-headline text-2xl mt-8 mb-4">What's Next?</h3>
<p>With this solid foundation in place, our team is now shifting focus to bringing the next phase of ZenJar to life. We're incredibly excited to start working on the immersive 3D experiences, advanced AI features, and deeper integrations outlined in our public roadmap. Thank you for being part of the ZenJar journey!</p>
`
};


type PostContentProps = {
    post: {
        slug: string;
        title: string;
    }
}

export function PostContent({ post }: PostContentProps) {
    // In a real app, you'd fetch the specific post data based on the slug.
    // For this prototype, we'll just use the hardcoded postData.
    const fullPost = postData;

  return (
    <article className="max-w-3xl mx-auto">
        <div className="mb-8">
            <Link href="/public/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
            </Link>
        </div>
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl mb-4">{fullPost.title}</h1>
        <p className="text-muted-foreground">{fullPost.date} &middot; by {fullPost.author}</p>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
            {fullPost.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
      </header>

       <Card className="overflow-hidden mb-8">
        <Image
          src={fullPost.image.src}
          alt={fullPost.image.alt}
          width={1200}
          height={600}
          className="w-full object-cover"
          data-ai-hint={fullPost.image.aiHint}
        />
      </Card>

      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: fullPost.content }}
       />

    </article>
  );
}
