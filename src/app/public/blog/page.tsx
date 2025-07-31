import PublicLayout from '@/components/layout/public-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <PublicLayout>
      <div className="container max-w-4xl py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">
            ZenJar Blog
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            Insights on productivity, mindfulness, and product updates.
          </p>
        </header>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">Coming Soon</h2>
          <p className="text-muted-foreground mt-2">Our blog is under construction. Check back later for articles and updates!</p>
          <Button asChild className="mt-6">
            <Link href="/">Return to App</Link>
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
