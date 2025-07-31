
import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import AppHeader from "@/components/layout/app-header";

type MainLayoutProps = {
  children: ReactNode;
  title: string;
};

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh bg-background">
        <AppSidebar />
        <SidebarInset>
          <AppHeader title={title} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
