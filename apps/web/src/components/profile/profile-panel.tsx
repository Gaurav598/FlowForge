"use client";

import { Bell, Github, Globe, LockKeyhole, Mail, ShieldCheck, Sparkles, Trophy, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { focusSessions } from "@/lib/mock-data";

export function ProfilePanel() {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="mx-auto grid size-24 place-items-center rounded-lg bg-gradient-to-br from-sky-400 via-mint-300 to-peach-300 text-3xl font-black text-slate-950">
            AS
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Avery Stone</h2>
          <p className="mt-1 text-sm text-muted-foreground">Product Lead at Orbit Labs</p>
          <div className="mt-5 flex justify-center gap-2">
            <Badge variant="mint">Focus 92</Badge>
            <Badge variant="peach">18 day streak</Badge>
          </div>
          <div className="mt-6 grid gap-3 text-left">
            {[
              { icon: Mail, label: "avery@orbit.dev" },
              { icon: Globe, label: "flowforge.app/avery" },
              { icon: Github, label: "@averystone" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <span key={item.label} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3 text-sm">
                  <Icon className="size-4 text-primary" />
                  {item.label}
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Tasks shipped", value: "248", icon: UserRound },
            { label: "Focus hours", value: "642", icon: Sparkles },
            { label: "Badges", value: "34", icon: Trophy }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label}>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                  </div>
                  <span className="grid size-11 place-items-center rounded-md bg-primary/12 text-primary">
                    <Icon className="size-5" />
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Activity Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {focusSessions.flatMap((session, week) =>
                Array.from({ length: 7 }, (_, day) => (
                  <div
                    key={`${week}-${day}`}
                    className="aspect-square rounded-md border border-border"
                    style={{ background: `rgba(56, 189, 248, ${0.12 + ((session.score + day * 9) % 80) / 100})` }}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {[
                { label: "Mentions", icon: Bell },
                { label: "Deadline alerts", icon: Sparkles },
                { label: "Focus reminders", icon: Trophy }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3">
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <Icon className="size-4 text-primary" />
                      {item.label}
                    </span>
                    <Switch defaultChecked />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-lg border border-border bg-background/40 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5 text-mint-300" />
                  <p className="font-semibold">Two-factor authentication</p>
                </div>
                <Progress value={82} className="mt-4" />
              </div>
              <Button variant="glass">
                <LockKeyhole />
                Manage devices
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
