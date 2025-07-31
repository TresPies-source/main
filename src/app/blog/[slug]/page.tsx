
import PublicLayout from "@/components/layout/public-layout";
import { PostContent } from "@/components/features/blog/post-content";

type PostPageProps = {
    params: {
        slug: string;
    }
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <PublicLayout>
      <PostContent post={{ slug: params.slug, title: "Post Title" }}/>
    </PublicLayout>
  );
}

    