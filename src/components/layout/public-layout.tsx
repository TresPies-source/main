import { PublicHeader } from "@/components/layout/public-header";
import type { ReactNode } from "react";

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
                <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
                    <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                        Built with ZenJar. The source code is available on GitHub.
                    </p>
                </div>
            </footer>
        </div>
    );
}
