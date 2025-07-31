
import { PublicHeader } from "@/components/layout/public-header";
import type { ReactNode } from "react";
import Link from "next/link";

type PublicLayoutProps = {
    children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <PublicHeader />
            <main className="flex-1 container py-8">
                {children}
            </main>
            <footer className="py-6 md:px-8 md:py-0 border-t">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                        Built with ZenJar. The source code is available on GitHub.
                    </p>
                    <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Link href="/terms" className="hover:text-foreground">Terms</Link>
                        <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                        <Link href="/license" className="hover:text-foreground">License</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

    