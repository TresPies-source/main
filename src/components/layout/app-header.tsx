import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@/components/auth/user-button";
import { ZenSpeak } from "@/components/features/voice/zen-speak";

type AppHeaderProps = {
  title: string;
};

export default function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold tracking-tight text-foreground/90 font-headline">
        {title}
      </h1>
      <div className="ml-auto flex items-center gap-4">
        <ZenSpeak />
        <UserButton />
      </div>
    </header>
  );
}
