"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Gift,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
  Sparkles,
  Sunrise,
  Info,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

const menuItems = [
  { href: "/", label: "Growth", icon: LayoutDashboard },
  { href: "/tasks", label: "Task Jar", icon: ListTodo },
  { href: "/motivation", label: "Motivation Jar", icon: Sparkles },
  { href: "/gratitude", label: "Gratitude Jar", icon: Gift },
  { href: "/intention", label: "Intention Setter", icon: Sunrise },
];

const bottomMenuItems = [
    { href: "/settings", label: "Settings", icon: Settings },
]

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="block p-2 text-foreground/90 hover:text-foreground transition-colors">
            <span className="text-xl font-semibold font-headline">Zen Jar</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2 flex-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <ThemeSwitcher />
            </SidebarMenuItem>
            {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                >
                    <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith('/public/about')}
                    tooltip={{ children: 'About' }}
                >
                    <Link href="/public/about">
                    <Info />
                    <span>About</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith('/public/roadmap')}
                    tooltip={{ children: 'Roadmap' }}
                >
                    <Link href="/public/roadmap">
                    <Compass />
                    <span>Roadmap</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className="my-1"/>
        {user && (
          <Button variant="ghost" className="justify-start gap-2" onClick={signOut}>
            <LogOut />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
