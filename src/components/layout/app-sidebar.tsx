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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  BrainCircuit,
  Gift,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
  Sparkles,
  Sunrise,
} from "lucide-react";
import Link from "next/link";

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

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <BrainCircuit className="w-8 h-8 text-accent" />
          <span className="text-xl font-semibold font-headline">Zen Jar</span>
        </div>
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
        </SidebarMenu>
        <Button variant="ghost" className="justify-start gap-2">
          <LogOut />
           <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
