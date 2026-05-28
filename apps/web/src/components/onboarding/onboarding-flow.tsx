"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Check, KanbanSquare, Sparkles, Timer, UsersRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const steps = [
  { label: "Workspace", icon: UsersRound },
  { label: "Workflow", icon: KanbanSquare },
  { label: "Focus", icon: Timer },
  { label: "AI", icon: Bot }
];

export function OnboardingFlow() {
  const [step, setStep] = useState(0);

  return (
    <main className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-6xl gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="glass rounded-lg p-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-gradient-to-br from-sky-400 via-mint-300 to-peach-300 text-sm font-black text-slate-950">
              FF
            </span>
            <span className="font-semibold">FlowForge</span>
          </Link>
          <div className="mt-10 grid gap-3">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = index === step;
              const done = index < step;
              return (
                <button
                  key={item.label}
                  onClick={() => setStep(index)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                    active ? "border-primary bg-primary/12 text-primary" : "border-border bg-background/35 text-muted-foreground"
                  }`}
                >
                  <span className="grid size-9 place-items-center rounded-md bg-background">
                    {done ? <Check className="size-4 text-mint-300" /> : <Icon className="size-4" />}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="glass flex flex-col rounded-lg p-5 sm:p-8">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="grid flex-1 content-center gap-8"
          >
            {step === 0 && (
              <div className="max-w-2xl">
                <Badge variant="mint">Workspace setup</Badge>
                <h1 className="mt-4 text-4xl font-semibold tracking-normal">Shape the space your team will work from.</h1>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Workspace name
                    <Input placeholder="Orbit Labs" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Team size
                    <Input placeholder="12" inputMode="numeric" />
                  </label>
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <Badge variant="violet">Workflow blueprint</Badge>
                <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-normal">Choose a workflow baseline.</h1>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {["Kanban", "Scrum", "Hybrid"].map((label) => (
                    <Card key={label} className="border-primary/25">
                      <CardContent className="p-5">
                        <KanbanSquare className="size-6 text-primary" />
                        <p className="mt-5 text-lg font-semibold">{label}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">Statuses, swimlanes, labels, automation, and analytics presets.</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <Badge variant="peach">Focus preferences</Badge>
                <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-normal">Set the deep work rhythm.</h1>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {["25/5", "50/10", "Custom"].map((label) => (
                    <button key={label} className="rounded-lg border border-border bg-background/45 p-6 text-left transition hover:border-primary">
                      <Timer className="size-6 text-primary" />
                      <p className="mt-5 text-2xl font-semibold">{label}</p>
                      <p className="mt-2 text-sm text-muted-foreground">Focus timer preset</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <Badge variant="mint">AI planner</Badge>
                <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-normal">Let FlowForge draft the first sprint.</h1>
                <div className="mt-8 rounded-lg border border-border bg-background/45 p-5">
                  <div className="flex items-center gap-3">
                    <Sparkles className="size-5 text-primary" />
                    <p className="font-semibold">Release Orion candidate plan</p>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {["18 tasks", "74 points", "92 focus score"].map((item) => (
                      <div key={item} className="rounded-lg border border-border bg-card p-4 text-lg font-semibold">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button variant="glass" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>
                Continue
                <ArrowRight />
              </Button>
            ) : (
              <Button asChild>
                <Link href="/dashboard">
                  Open FlowForge
                  <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
