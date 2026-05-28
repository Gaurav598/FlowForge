"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BrainCircuit, Gauge, GitPullRequestArrow, Target, Timer, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { focusSessions } from "@/lib/mock-data";

const burndown = [
  { day: "D1", ideal: 80, actual: 80 },
  { day: "D2", ideal: 68, actual: 73 },
  { day: "D3", ideal: 56, actual: 60 },
  { day: "D4", ideal: 44, actual: 49 },
  { day: "D5", ideal: 32, actual: 34 },
  { day: "D6", ideal: 20, actual: 18 },
  { day: "D7", ideal: 0, actual: 4 }
];

const throughput = [
  { week: "W1", shipped: 24, planned: 28 },
  { week: "W2", shipped: 31, planned: 30 },
  { week: "W3", shipped: 29, planned: 34 },
  { week: "W4", shipped: 38, planned: 36 }
];

export function AnalyticsSuite() {
  return (
    <div className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Velocity", value: "74 pts", icon: TrendingUp },
          { label: "Focus ROI", value: "2.4x", icon: Timer },
          { label: "Risk score", value: "Low", icon: Gauge },
          { label: "AI confidence", value: "91%", icon: BrainCircuit }
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
                </div>
                <span className="grid size-11 place-items-center rounded-md bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Burn-down</CardTitle>
            <Badge variant="mint">On pace</Badge>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={{ width: 640, height: 320 }}>
              <LineChart data={burndown}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Line dataKey="ideal" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} />
                <Line dataKey="actual" stroke="#38bdf8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Throughput</CardTitle>
            <GitPullRequestArrow className="size-5 text-primary" />
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={{ width: 640, height: 320 }}>
              <BarChart data={throughput}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="planned" fill="#c9a8ff" radius={[8, 8, 0, 0]} />
                <Bar dataKey="shipped" fill="#7dffc8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Focus-to-Delivery Correlation</CardTitle>
            <p className="text-sm text-muted-foreground">AI insight layer</p>
          </div>
          <Target className="size-5 text-primary" />
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={{ width: 960, height: 300 }}>
            <AreaChart data={focusSessions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Area dataKey="minutes" stroke="#38bdf8" fill="#38bdf855" strokeWidth={3} />
              <Area dataKey="score" stroke="#ffa16f" fill="#ffa16f22" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
