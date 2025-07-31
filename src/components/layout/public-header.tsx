'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <BrainCircuit className="h-6 w-6 text-accent" />
          <span className="font-bold font-headline">ZenJar</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/about" className={cn("transition-colors hover:text-foreground/80", pathname === "/about" ? "text-foreground" : "text-foreground/60")}>
                About
            </Link>
            <Link href="/roadmap" className={cn("transition-colors hover:text-foreground/80", pathname === "/roadmap" ? "text-foreground" : "text-foreground/60")}>
                Roadmap
            </Link>
            <Link href="/public/blog" className={cn("transition-colors hover:text-foreground/80", pathname.startsWith("/public/blog") ? "text-foreground" : "text-foreground/60")}>
                Blog
            </Link>
            <Link href="/public/privacy" className={cn("transition-colors hover:text-foreground/80", pathname === "/public/privacy" ? "text-foreground" : "text-foreground/60")}>
                Privacy
            </Link>
             <Link href="/public/terms" className={cn("transition-colors hover:text-foreground/80", pathname === "/public/terms" ? "text-foreground" : "text-foreground/60")}>
                Terms
            </Link>
            <Link href="/public/license" className={cn("transition-colors hover:text-foreground/80", pathname === "/public/license" ? "text-foreground" : "text-foreground/60")}>
                License
            </Link>
        </nav>
        <div className="flex-1 flex justify-end">
            <Button asChild>
                <Link href="/">Return to App</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
