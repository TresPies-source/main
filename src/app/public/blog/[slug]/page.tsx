'use client';

import PublicLayout from "@/components/layout/public-layout";
import { PostContent } from "@/components/features/blog/post-content";
import { notFound } from "next/navigation";

// In a real app, you would fetch this data from a CMS.
const posts = [
  {
    slug: "big-updates-and-a-solid-foundation",
    title: "Big Updates and a Solid Foundation",
  }
];


export default function PostPage({ params }: { params: { slug: string } }) {
    const post = posts.find(p => p.slug === params.slug);

    if (!post) {
        notFound();
    }

  return (
    <PublicLayout>
      <PostContent post={post} />
    </PublicLayout>
  );
}
