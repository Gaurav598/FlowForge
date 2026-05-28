"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task } from "@/lib/types";
import { tasks } from "@/lib/mock-data";

type TimerMode = "25/5" | "50/10" | "custom" | "stopwatch";

type FlowForgeState = {
  tasks: Task[];
  commandOpen: boolean;
  focusTaskId: string;
  timerMode: TimerMode;
  setCommandOpen: (open: boolean) => void;
  moveTask: (taskId: string, status: Task["status"]) => void;
  setFocusTask: (taskId: string) => void;
  setTimerMode: (mode: TimerMode) => void;
};

export const useFlowForgeStore = create<FlowForgeState>()(
  persist(
    (set) => ({
      tasks,
      commandOpen: false,
      focusTaskId: "FF-118",
      timerMode: "25/5",
      setCommandOpen: (open) => set({ commandOpen: open }),
      moveTask: (taskId, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, status } : task))
        })),
      setFocusTask: (taskId) => set({ focusTaskId: taskId }),
      setTimerMode: (mode) => set({ timerMode: mode })
    }),
    {
      name: "flowforge-state",
      partialize: (state) => ({
        tasks: state.tasks,
        focusTaskId: state.focusTaskId,
        timerMode: state.timerMode
      })
    }
  )
);
