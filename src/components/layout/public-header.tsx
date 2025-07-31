
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/about", label: "About" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/blog", label: "Blog" },
]

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
            {navLinks.map(({ href, label }) => (
                 <Link key={label} href={href} className={cn("transition-colors hover:text-foreground/80", pathname === href ? "text-foreground" : "text-foreground/60")}>
                    {label}
                </Link>
            ))}
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

    