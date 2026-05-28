"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, BrainCircuit, CalendarDays, CheckCircle2, Command, LayoutDashboard, LockKeyhole, Sparkles, Timer, UsersRound } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { LiveWallpaper } from "@/components/three/live-wallpaper";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { sprintMetrics, tasks } from "@/lib/mock-data";

const capabilities = [
  { label: "Sprint AI", icon: BrainCircuit, text: "Capacity-aware planning and work breakdown" },
  { label: "Kanban OS", icon: LayoutDashboard, text: "Boards, swimlanes, dependencies, timelines" },
  { label: "Focus Engine", icon: Timer, text: "Pomodoro, deep work, achievements, heatmaps" },
  { label: "Team Flow", icon: UsersRound, text: "Presence, mentions, chat, activity, workload" },
  { label: "Calendar Sync", icon: CalendarDays, text: "Agenda, timeline, drag scheduling, Google sync" },
  { label: "Secure Core", icon: LockKeyhole, text: "JWT, 2FA, device sessions, role policies" }
];

export function LandingPage() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 24 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  return (
    <main
      ref={ref}
      className="relative min-h-screen overflow-hidden"
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      <section className="relative min-h-[88vh] overflow-hidden">
        <LiveWallpaper />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--background))_98%)]" />
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-gradient-to-br from-sky-400 via-mint-300 to-peach-300 text-sm font-black text-slate-950">
              FF
            </span>
            <span className="font-semibold">FlowForge</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <Link href="/board/flowforge-os" className="hover:text-foreground">Boards</Link>
            <Link href="/focus" className="hover:text-foreground">Focus</Link>
            <Link href="/analytics" className="hover:text-foreground">Analytics</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
              <Link href="/dashboard">
                Launch
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:pt-20">
          <div>
            <Badge variant="mint">AI-powered productivity OS</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
              FlowForge
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-muted-foreground">
              Plan Faster. Focus Better. Deliver Smarter.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              A cinematic workspace for teams that want sprint planning, Kanban, real-time collaboration, AI insight, and deep work in one premium product surface.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/onboarding">
                  Start onboarding
                  <Sparkles />
                </Link>
              </Button>
              <Button size="lg" variant="glass" asChild>
                <Link href="/login">
                  Sign in
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>

          <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="perspective-distant">
            <div className="glass rounded-lg p-3 shadow-2xl">
              <div className="rounded-lg border border-border bg-background/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Release Orion</p>
                    <p className="text-xs text-muted-foreground">Sprint confidence 97%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="mint">Live</Badge>
                    <Badge variant="peach">AI ranked</Badge>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {sprintMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-lg border border-border bg-card p-4">
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-3">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="rounded-lg border border-border bg-background/45 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{task.title}</p>
                        <span className="text-xs text-muted-foreground">{task.storyPoints} pts</span>
                      </div>
                      <Progress value={task.progress} className="mt-3" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-12 md:grid-cols-2 xl:grid-cols-3">
        {capabilities.map((capability) => {
          const Icon = capability.icon;
          return (
            <Card key={capability.label}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 place-items-center rounded-md bg-primary/12 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold">{capability.label}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{capability.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="grid gap-5 rounded-lg border border-border bg-background/50 p-5 backdrop-blur-xl lg:grid-cols-[1fr_380px]">
          <div className="grid gap-3 md:grid-cols-3">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="rounded-lg border border-border bg-card p-4">
                <CheckCircle2 className="size-5 text-mint-300" />
                <p className="mt-4 text-sm font-semibold">{task.id}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{task.summary}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-slate-950 p-5 text-white">
            <Command className="size-5 text-cyan-200" />
            <h2 className="mt-4 text-2xl font-semibold">Command-ready</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Search tasks, create actions, open boards, summarize sprints, and jump between focus blocks from one fast palette.
            </p>
            <Button className="mt-5" asChild>
              <Link href="/dashboard">Open workspace</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
