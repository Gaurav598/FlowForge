"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const currentTheme = theme ?? resolvedTheme ?? "dark";
  const nextTheme = currentTheme === "dark" ? "light" : currentTheme === "light" ? "system" : "dark";
  const Icon = currentTheme === "dark" ? Moon : currentTheme === "light" ? Sun : Laptop;

  return (
    <Button variant="glass" size="icon" aria-label="Toggle theme" onClick={() => setTheme(nextTheme)}>
      <Icon />
    </Button>
  );
}
