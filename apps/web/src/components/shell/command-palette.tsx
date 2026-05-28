"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CalendarDays, Gauge, LayoutDashboard, ListChecks, Search, Sparkles, Timer, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useFlowForgeStore } from "@/store/use-flowforge-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const actions = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Board", href: "/board/flowforge-os", icon: ListChecks },
  { label: "Focus", href: "/focus", icon: Timer },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/analytics", icon: Gauge },
  { label: "Profile", href: "/profile", icon: UserRound }
];

export function CommandPalette() {
  const open = useFlowForgeStore((state) => state.commandOpen);
  const setOpen = useFlowForgeStore((state) => state.setCommandOpen);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm" />
        <Dialog.Content className="glass fixed left-1/2 top-[14vh] z-50 w-[min(92vw,640px)] -translate-x-1/2 overflow-hidden rounded-lg">
          <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
          <Dialog.Description className="sr-only">Search for actions and pages</Dialog.Description>
          <div className="flex items-center gap-3 border-b border-border p-4">
            <Search className="size-5 text-primary" />
            <Input autoFocus placeholder="Search tasks, people, sprints, actions" className="border-0 bg-transparent shadow-none" />
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close command palette">
                <X />
              </Button>
            </Dialog.Close>
          </div>
          <div className="grid gap-2 p-3">
            <div className="rounded-md bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
              AI suggests planning the release retro after the active sprint closes.
            </div>
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Dialog.Close key={action.href} asChild>
                  <Link
                    href={action.href}
                    className="flex items-center justify-between rounded-md px-3 py-3 text-sm transition hover:bg-muted"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="size-4 text-muted-foreground" />
                      {action.label}
                    </span>
                    <Sparkles className="size-4 text-primary/70" />
                  </Link>
                </Dialog.Close>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
