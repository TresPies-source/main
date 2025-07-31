import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-accent" />
          <span className="font-bold font-headline">ZenJar</span>
        </Link>
        <nav className="flex items-center space-x-4">
            <Button asChild>
                <Link href="/">Return to App</Link>
            </Button>
        </nav>
      </div>
    </header>
  );
}
