"use client";

import { Github, KeyRound, Mail, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LiveWallpaper } from "@/components/three/live-wallpaper";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden p-5">
      <LiveWallpaper className="opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.24),hsl(var(--background)))]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid w-full max-w-5xl gap-5 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <section className="flex flex-col justify-between rounded-lg border border-border bg-background/45 p-6 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-gradient-to-br from-sky-400 via-mint-300 to-peach-300 text-sm font-black text-slate-950">
              FF
            </span>
            <span className="font-semibold">FlowForge</span>
          </Link>
          <div className="my-12">
            <p className="text-sm font-semibold text-primary">Secure workspace access</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal">{title}</h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{subtitle}</p>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-mint-300" />
              JWT sessions, refresh rotation, device management
            </span>
            <span className="flex items-center gap-3">
              <KeyRound className="size-4 text-peach-300" />
              Email verification, OAuth, and 2FA-ready flows
            </span>
          </div>
        </section>

        <Card>
          <CardContent className="p-6 sm:p-8">{children}</CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

export function OAuthButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button variant="glass" type="button">
        <Mail />
        Google
      </Button>
      <Button variant="glass" type="button">
        <Github />
        GitHub
      </Button>
    </div>
  );
}

export function TwoFactorPreview() {
  return (
    <div className="rounded-lg border border-border bg-primary/8 p-4">
      <div className="flex items-center gap-3">
        <Sparkles className="size-4 text-primary" />
        <p className="text-sm font-semibold">Adaptive verification enabled</p>
      </div>
      <div className="mt-4 grid grid-cols-6 gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Input key={index} inputMode="numeric" maxLength={1} className="h-11 text-center" aria-label={`2FA digit ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}
