"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock, GripVertical, Plus, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasks } from "@/lib/mock-data";

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const agenda = [
  { time: "09:30", label: "Sprint planning", type: "Ceremony" },
  { time: "11:00", label: "AI planner review", type: "Focus" },
  { time: "14:30", label: "Deep work block", type: "Pomodoro" },
  { time: "16:00", label: "Release risk sync", type: "Meet" }
];

export function FlowCalendar() {
  return (
    <div className="grid gap-5">
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-background/45 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div>
          <Badge variant="mint">Timeline mode</Badge>
          <h2 className="mt-3 text-2xl font-semibold">Calendar Command</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Schedule focus blocks, sprint rituals, task deadlines, and release milestones from one adaptive calendar.
          </p>
        </div>
        <Button>
          <Plus />
          New block
        </Button>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly Flow</CardTitle>
              <p className="text-sm text-muted-foreground">Drag-ready schedule surface</p>
            </div>
            <CalendarDays className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {week.map((day, dayIndex) => (
                <div key={day} className="min-h-[420px] rounded-lg border border-border bg-background/40 p-2">
                  <p className="mb-3 text-center text-xs font-semibold text-muted-foreground">{day}</p>
                  <div className="grid gap-2">
                    {tasks
                      .filter((_, index) => (index + dayIndex) % 3 === 0)
                      .slice(0, 2)
                      .map((task) => (
                        <motion.div
                          key={`${day}-${task.id}`}
                          whileHover={{ y: -2 }}
                          className="rounded-lg border border-border bg-card p-3 text-xs shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="size-3.5 text-muted-foreground" />
                            <span className="font-semibold">{task.id}</span>
                          </div>
                          <p className="mt-2 leading-5 text-muted-foreground">{task.title}</p>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {agenda.map((item) => (
                <div key={item.time} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3">
                  <span className="grid size-10 place-items-center rounded-md bg-primary/12 text-primary">
                    {item.type === "Meet" ? <Video className="size-4" /> : <Clock className="size-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.time} - {item.type}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Calendar Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                OAuth scopes, conflict detection, push notifications, and two-way event mapping are represented in the API contract.
              </p>
              <Button variant="glass" className="mt-4">Connect Google</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
