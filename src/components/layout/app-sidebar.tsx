
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
  Rss,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

const menuItems = [
  { href: "/", label: "Growth", icon: LayoutDashboard },
  { href: "/tasks", label: "Task Jar", icon: ListTodo },
  { href: "/motivation", label: "Motivation Jar", icon: Sparkles },
  { href: "/gratitude", label: "Gratitude Jar", icon: Gift },
  { href: "/wins", label: "Win Jar", icon: Trophy },
  { href: "/intention", label: "Intention Setter", icon: Sunrise },
];

const publicMenuItems = [
    { href: "/about", label: "About", icon: Info },
    { href: "/roadmap", label: "Roadmap", icon: Compass },
    { href: "/blog", label: "Blog", icon: Rss },
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
            {publicMenuItems.map((item) => (
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
            <SidebarSeparator className="my-1"/>
            <SidebarMenuItem>
                <ThemeSwitcher />
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === '/settings'}
                    tooltip={{ children: 'Settings' }}
                >
                    <Link href={'/settings'}>
                        <Settings />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        {user && (
          <Button variant="ghost" className="justify-start gap-2 mt-2" onClick={signOut}>
            <LogOut />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

    