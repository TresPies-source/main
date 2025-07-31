
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

const posts = [
  {
    slug: "big-updates-and-a-solid-foundation",
    title: "Big Updates and a Solid Foundation",
    date: "July 26, 2024",
    author: "The ZenJar Team",
    tags: ["Update", "Security", "Performance"],
    image: {
      src: "https://placehold.co/800x400.png",
      alt: "Abstract image representing stability and growth",
      aiHint: "stability growth"
    },
    excerpt: "We've been hard at work solidifying ZenJar's foundation. This update brings major improvements to security, reliability, and performance, paving the way for exciting new features."
  }
];

export function BlogContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">The ZenJar Blog</h1>
        <p className="text-lg mt-2 text-muted-foreground">
          Updates, insights, and stories on mindful productivity.
        </p>
      </div>

      <div className="space-y-12">
        {posts.map((post) => (
          <Card key={post.slug} className="group overflow-hidden">
            <Link href={`/blog/${post.slug}`}>
              <div className="overflow-hidden rounded-t-lg">
                <Image 
                  src={post.image.src} 
                  alt={post.image.alt} 
                  width={800} 
                  height={400}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={post.image.aiHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{post.date} &middot; by {post.author}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

    