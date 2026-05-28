"use client";

import { motion } from "framer-motion";
import { Award, BellRing, Brain, ChevronDown, Headphones, Maximize2, Pause, Play, RotateCcw, SkipForward, Sparkles, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { heatmap, tasks } from "@/lib/mock-data";
import { formatTimer } from "@/lib/utils";
import { useFlowForgeStore } from "@/store/use-flowforge-store";

const modeDurations = {
  "25/5": 25 * 60,
  "50/10": 50 * 60,
  custom: 35 * 60,
  stopwatch: 0
} as const;

const leaderboard = [
  { name: "Mira Kapoor", score: 96, sessions: 18 },
  { name: "Noah Chen", score: 92, sessions: 14 },
  { name: "Avery Stone", score: 89, sessions: 12 }
];

export function PomodoroPanel() {
  const timerMode = useFlowForgeStore((state) => state.timerMode);
  const setTimerMode = useFlowForgeStore((state) => state.setTimerMode);
  const focusTaskId = useFlowForgeStore((state) => state.focusTaskId);
  const setFocusTask = useFlowForgeStore((state) => state.setFocusTask);
  const [seconds, setSeconds] = useState(modeDurations[timerMode]);
  const [running, setRunning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [ambient, setAmbient] = useState(true);
  const [autoLink, setAutoLink] = useState(true);

  const linkedTask = tasks.find((task) => task.id === focusTaskId) ?? tasks[0];
  const duration = modeDurations[timerMode] || Math.max(seconds, 1);
  const progress = timerMode === "stopwatch" ? Math.min(100, (seconds / 3600) * 100) : ((duration - seconds) / duration) * 100;

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setSeconds((value) => {
        if (timerMode === "stopwatch") return value + 1;
        if (value <= 1) {
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, timerMode]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.code === "Space" && event.target === document.body) {
        event.preventDefault();
        setRunning((value) => !value);
      }
      if (event.key.toLowerCase() === "r") {
        setSeconds(modeDurations[timerMode]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [timerMode]);

  const shellClass = fullscreen
    ? "fixed inset-0 z-50 overflow-y-auto bg-background p-4 sm:p-8"
    : "grid gap-5";

  const achievements = useMemo(
    () => [
      { label: "Deep Work III", icon: Trophy, tone: "text-peach-300" },
      { label: "7 Day Flame", icon: Award, tone: "text-mint-300" },
      { label: "Flow State", icon: Brain, tone: "text-sky-300" }
    ],
    []
  );

  const selectMode = (mode: typeof timerMode) => {
    setTimerMode(mode);
    setSeconds(modeDurations[mode]);
    setRunning(false);
  };

  return (
    <div className={shellClass}>
      <section className="relative overflow-hidden rounded-lg border border-border bg-slate-950 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.28),transparent_34rem),radial-gradient(circle_at_80%_10%,rgba(255,161,111,0.22),transparent_28rem),linear-gradient(135deg,#0f172a,#111827_42%,#172554)]" />
        <div className="premium-grid absolute inset-0 opacity-35" />
        <div className="relative grid gap-8 p-5 md:grid-cols-[1fr_360px] md:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {(["25/5", "50/10", "custom", "stopwatch"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={timerMode === mode ? "secondary" : "glass"}
                  size="sm"
                  onClick={() => selectMode(mode)}
                  className="border-white/20 bg-white/10 text-white hover:bg-white/18"
                >
                  {mode}
                </Button>
              ))}
            </div>
            <motion.div
              animate={{ scale: running ? [1, 1.015, 1] : 1 }}
              transition={{ repeat: running ? Infinity : 0, duration: 4 }}
              className="my-10 grid place-items-center"
            >
              <div className="relative grid aspect-square w-[min(72vw,380px)] place-items-center rounded-full border border-white/20 bg-white/8 shadow-[0_0_120px_rgba(56,189,248,0.24)] backdrop-blur-xl">
                <div className="absolute inset-6 rounded-full border border-cyan-200/20" />
                <div className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">Deep Work</p>
                  <strong className="mt-4 block text-6xl font-semibold tracking-normal sm:text-7xl">{formatTimer(seconds)}</strong>
                  <p className="mt-4 text-sm text-slate-300">{linkedTask.id} - {linkedTask.title}</p>
                </div>
              </div>
            </motion.div>
            <Progress value={progress} className="h-2 bg-white/15" />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => setRunning((value) => !value)}>
                {running ? <Pause /> : <Play />}
                {running ? "Pause" : "Start"}
              </Button>
              <Button variant="glass" size="lg" className="border-white/20 bg-white/10 text-white" onClick={() => setSeconds(modeDurations[timerMode])}>
                <RotateCcw />
                Reset
              </Button>
              <Button variant="glass" size="lg" className="border-white/20 bg-white/10 text-white">
                <SkipForward />
                Break
              </Button>
              <Button variant="glass" size="icon" className="border-white/20 bg-white/10 text-white" onClick={() => setFullscreen((value) => !value)}>
                <Maximize2 />
              </Button>
            </div>
          </div>

          <aside className="grid content-start gap-4">
            <Card className="border-white/20 bg-white/10 text-white">
              <CardHeader>
                <CardTitle>Linked Task</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <button className="flex items-center justify-between rounded-lg border border-white/15 bg-white/10 p-3 text-left">
                  <span>
                    <span className="block text-sm font-semibold">{linkedTask.title}</span>
                    <span className="block text-xs text-slate-300">{linkedTask.id} - {linkedTask.storyPoints} points</span>
                  </span>
                  <ChevronDown className="size-4" />
                </button>
                <div className="grid gap-2">
                  {tasks.slice(0, 3).map((task) => (
                    <button
                      key={task.id}
                      className="rounded-md px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                      onClick={() => setFocusTask(task.id)}
                    >
                      {task.id} - {task.title}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 text-white">
              <CardContent className="grid gap-4 p-5">
                {[
                  { label: "Ambient sound", value: ambient, set: setAmbient, icon: Headphones },
                  { label: "Auto task linking", value: autoLink, set: setAutoLink, icon: Sparkles },
                  { label: "Deadline reminders", value: true, set: () => undefined, icon: BellRing }
                ].map((setting) => {
                  const Icon = setting.icon;
                  return (
                    <div key={setting.label} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-3 text-sm">
                        <Icon className="size-4 text-cyan-200" />
                        {setting.label}
                      </span>
                      <Switch checked={setting.value} onCheckedChange={setting.set} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Focus Heatmap</CardTitle>
              <p className="text-sm text-muted-foreground">Last seven weeks</p>
            </div>
            <Badge variant="mint">18 day streak</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {heatmap.map((cell) => (
                <div
                  key={cell.id}
                  className="aspect-square rounded-md border border-border"
                  style={{
                    backgroundColor: `rgba(45, 212, 191, ${cell.intensity})`
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Focus Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {leaderboard.map((row, index) => (
              <div key={row.name} className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-md bg-primary/12 text-sm font-bold text-primary">{index + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold">{row.name}</span>
                    <span className="block text-xs text-muted-foreground">{row.sessions} sessions</span>
                  </span>
                </div>
                <Badge variant={index === 0 ? "peach" : "slate"}>{row.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <Card key={achievement.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <span className="grid size-11 place-items-center rounded-md bg-muted">
                  <Icon className={`size-5 ${achievement.tone}`} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{achievement.label}</p>
                  <p className="text-xs text-muted-foreground">Unlocked this sprint</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
