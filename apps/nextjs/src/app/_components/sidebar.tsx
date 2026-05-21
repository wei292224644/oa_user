"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ListBulletIcon } from "@radix-ui/react-icons";

import { cn } from "@acme/ui";
import { Avatar, AvatarFallback } from "@acme/ui/avatar";
import { Separator } from "@acme/ui/separator";

const navItems = [
  { label: "首页", href: "/", icon: HomeIcon },
  { label: "案件列表", href: "/cases", icon: ListBulletIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex h-16 items-center px-6">
        <span className="text-xl font-bold">
          OA <span className="text-primary">Case</span>
        </span>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User */}
      <div className="flex items-center gap-3 px-4 py-4">
        <Avatar size="sm">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">User</span>
          <span className="text-xs text-muted-foreground">Admin</span>
        </div>
      </div>
    </aside>
  );
}
