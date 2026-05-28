"use client";

import {
  Bell,
  CalendarDays,
  Gauge,
  Home,
  LayoutDashboard,
  ListChecks,
  Search,
  Settings,
  Sparkles,
  Timer,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/hooks/use-socket";
import { cn } from "@/lib/utils";
import { users } from "@/lib/mock-data";
import { useFlowForgeStore } from "@/store/use-flowforge-store";

const navigation = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Board", href: "/board/flowforge-os", icon: ListChecks },
  { label: "Focus", href: "/focus", icon: Timer },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/analytics", icon: Gauge },
  { label: "Profile", href: "/profile", icon: UserRound }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { connected } = useSocket();
  const setCommandOpen = useFlowForgeStore((state) => state.setCommandOpen);

  return (
    <div className="min-h-screen p-3 sm:p-4">
      <div className="mx-auto grid min-h-[calc(100vh-32px)] max-w-[1800px] gap-4 lg:grid-cols-[248px_1fr]">
        <aside className="glass sticky top-4 hidden h-[calc(100vh-32px)] rounded-lg p-4 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3 px-2">
            <span className="grid size-10 place-items-center rounded-md bg-gradient-to-br from-sky-400 via-mint-300 to-peach-300 text-sm font-black text-slate-950">
              FF
            </span>
            <span>
              <span className="block text-sm font-semibold">FlowForge</span>
              <span className="block text-xs text-muted-foreground">Orbit Workspace</span>
            </span>
          </Link>
          <nav className="mt-8 grid gap-1">
            {navigation.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                    active && "bg-primary/12 text-primary"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-lg border border-border bg-background/35 p-3">
            <div className="flex items-center justify-between">
              <Badge variant={connected ? "mint" : "slate"}>{connected ? "Live" : "Offline"}</Badge>
              <Sparkles className="size-4 text-primary" />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Realtime rooms, focus signals, and AI planning are ready for this workspace.
            </p>
          </div>
        </aside>

        <main className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-background/45 shadow-2xl shadow-slate-950/10 backdrop-blur-xl">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Plan Faster. Focus Better.</p>
              <h1 className="text-lg font-semibold sm:text-xl">FlowForge Command Center</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="glass" className="hidden sm:inline-flex" onClick={() => setCommandOpen(true)}>
                <Search />
                Command
              </Button>
              <Button variant="glass" size="icon" aria-label="Notifications">
                <Bell />
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: "easeOut" }}
            className="p-4 sm:p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <nav className="glass fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-lg p-1 shadow-2xl lg:hidden">
        {navigation.slice(1, 6).map((item) => {
          const active = pathname.startsWith(item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href);
          const Icon = item.icon;
          return (
            <Link
              aria-label={item.label}
              key={item.href}
              href={item.href}
              className={cn("rounded-md p-3 text-muted-foreground transition", active && "bg-primary text-primary-foreground")}
            >
              <Icon className="size-5" />
            </Link>
          );
        })}
      </nav>

      <div className="fixed bottom-4 right-4 z-40 hidden items-center gap-1 rounded-lg border border-border bg-background/75 p-1 backdrop-blur-lg xl:flex">
        {users.map((user) => (
          <span
            key={user.id}
            title={`${user.name} - ${user.presence}`}
            className={cn(
              "grid size-8 place-items-center rounded-md text-xs font-bold",
              user.presence === "focus" && "bg-peach-300 text-slate-950",
              user.presence === "online" && "bg-mint-300 text-slate-950",
              user.presence === "offline" && "bg-muted text-muted-foreground"
            )}
          >
            {user.avatar}
          </span>
        ))}
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings />
        </Button>
      </div>
    </div>
  );
}
