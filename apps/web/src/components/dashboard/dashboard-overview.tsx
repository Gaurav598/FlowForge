"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { Activity, BrainCircuit, CalendarClock, Flame, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { activity, focusSessions, sprintMetrics, tasks } from "@/lib/mock-data";
import { formatMinutes } from "@/lib/utils";

const workload = [
  { name: "Avery", tasks: 12, focus: 32 },
  { name: "Mira", tasks: 9, focus: 41 },
  { name: "Noah", tasks: 15, focus: 36 },
  { name: "Elena", tasks: 8, focus: 27 }
];

const toneMap = {
  blue: "from-sky-400/24 to-cyan-300/10 text-sky-500",
  mint: "from-mint-300/24 to-emerald-300/10 text-emerald-500",
  peach: "from-peach-300/28 to-amber-200/10 text-orange-500",
  violet: "from-lavender-300/24 to-fuchsia-300/10 text-lavender-500"
};

export function DashboardOverview() {
  const activeTasks = tasks.filter((task) => task.status === "active");
  const totalFocus = focusSessions.reduce((sum, day) => sum + day.minutes, 0);

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sprintMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden">
              <CardContent className={`bg-gradient-to-br p-5 ${toneMap[metric.tone]}`}>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                  <TrendingUp className="size-4" />
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <strong className="text-3xl font-semibold tracking-normal text-foreground">{metric.value}</strong>
                  <Badge variant="slate">{metric.delta}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Productivity Pulse</CardTitle>
              <p className="text-sm text-muted-foreground">{formatMinutes(totalFocus)} in focused delivery this week</p>
            </div>
            <Badge variant="mint">AI forecast +11%</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={{ width: 720, height: 300 }}>
                <AreaChart data={focusSessions}>
                  <defs>
                    <linearGradient id="focusGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#7dffc8" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      backdropFilter: "blur(18px)"
                    }}
                  />
                  <Area type="monotone" dataKey="minutes" stroke="#38bdf8" fill="url(#focusGradient)" strokeWidth={3} />
                  <Area type="monotone" dataKey="score" stroke="#ffa16f" fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sprint</CardTitle>
            <p className="text-sm text-muted-foreground">Release Orion, Sprint 12</p>
          </CardHeader>
          <CardContent className="grid gap-4">
            {activeTasks.map((task) => (
              <div key={task.id} className="rounded-lg border border-border bg-background/45 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{task.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{task.id} - {task.storyPoints} points</p>
                  </div>
                  <Badge variant={task.priority === "urgent" ? "peach" : "default"}>{task.priority}</Badge>
                </div>
                <Progress value={task.progress} className="mt-3" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Team Workload</CardTitle>
              <p className="text-sm text-muted-foreground">Tasks and focus hours by teammate</p>
            </div>
            <Users className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={{ width: 720, height: 260 }}>
                <BarChart data={workload}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))"
                    }}
                  />
                  <Bar dataKey="tasks" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="focus" fill="#7dffc8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Collaboration stream</p>
          </CardHeader>
          <CardContent className="grid gap-4">
            {activity.map((item) => (
              <div key={item.id} className="flex gap-3">
                <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-md bg-primary/12 text-primary">
                  <Activity className="size-4" />
                </span>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{item.user}</span> {item.action}{" "}
                    <span className="font-semibold">{item.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Deep work streak", value: "18 days", icon: Flame, variant: "peach" },
          { label: "AI prioritization", value: "34 tasks ranked", icon: BrainCircuit, variant: "violet" },
          { label: "Next focus block", value: "14:30 - 15:20", icon: CalendarClock, variant: "mint" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-xl font-semibold">{item.value}</p>
                </div>
                <span className="grid size-11 place-items-center rounded-md bg-muted">
                  <Icon className="size-5 text-primary" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
