"use client";

import { DndContext, DragEndEvent, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, CalendarClock, CheckCircle2, Clock3, FileText, GripVertical, MessageCircle, Paperclip, Plus, Route, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { boardColumns } from "@/lib/mock-data";
import type { Task, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useFlowForgeStore } from "@/store/use-flowforge-store";

const priorityBadge = {
  urgent: "peach",
  high: "default",
  medium: "violet",
  low: "slate"
} as const;

function DroppableColumn({ status, children }: { status: TaskStatus; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[520px] w-[320px] shrink-0 flex-col rounded-lg border border-border bg-background/40 p-3 transition",
        isOver && "border-primary bg-primary/8"
      )}
    >
      {children}
    </div>
  );
}

function TaskCard({ task, onSelect }: { task: Task; onSelect: (task: Task) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <motion.article
      layout
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={cn(
        "rounded-lg border border-border bg-card p-3 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-primary/40",
        isDragging && "z-30 opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button className="focus-ring rounded-md p-1 text-muted-foreground" {...attributes} {...listeners} aria-label="Drag task">
          <GripVertical className="size-4" />
        </button>
        <button className="min-w-0 flex-1 text-left" onClick={() => onSelect(task)}>
          <span className="text-xs font-semibold text-primary">{task.id}</span>
          <h3 className="mt-1 text-sm font-semibold leading-5">{task.title}</h3>
        </button>
        <Badge variant={priorityBadge[task.priority]}>{task.priority}</Badge>
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">{task.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {task.labels.map((label) => (
          <Badge key={label} variant="slate">
            {label}
          </Badge>
        ))}
      </div>
      <Progress value={task.progress} className="mt-3" />
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarClock className="size-3.5" />
          {task.dueDate}
        </span>
        <span>{task.storyPoints} pts</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-1">
          {task.assignees.map((assignee) => (
            <span key={assignee} className="grid size-7 place-items-center rounded-md border border-background bg-muted text-[10px] font-bold">
              {assignee}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageCircle className="size-3.5" />
            {task.comments}
          </span>
          <span className="flex items-center gap-1">
            <Paperclip className="size-3.5" />
            {task.attachments}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function TaskInspector({ task, onClose }: { task: Task | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {task ? (
        <motion.aside
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 36 }}
          className="glass fixed inset-y-4 right-4 z-50 flex w-[min(92vw,440px)] flex-col rounded-lg"
        >
          <div className="border-b border-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge>{task.id}</Badge>
                <h2 className="mt-3 text-xl font-semibold">{task.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{task.summary}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
          <div className="soft-scrollbar grid gap-5 overflow-y-auto p-5">
            <section className="rounded-lg border border-border bg-background/45 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">AI Summary</h3>
                <Bot className="size-4 text-primary" />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                This task is trending healthy. The only risk is unresolved dependency order with the active sprint planner.
              </p>
            </section>

            <section className="grid gap-3">
              <h3 className="text-sm font-semibold">Checklist</h3>
              {task.subtasks.map((subtask) => (
                <div key={subtask.title} className="flex items-center gap-3 rounded-lg border border-border bg-background/35 p-3">
                  <CheckCircle2 className={cn("size-4", subtask.done ? "text-emerald-400" : "text-muted-foreground")} />
                  <span className={cn("text-sm", subtask.done && "text-muted-foreground line-through")}>{subtask.title}</span>
                </div>
              ))}
            </section>

            <section className="rounded-lg border border-border bg-background/45 p-4">
              <h3 className="text-sm font-semibold">Rich Brief</h3>
              <div
                contentEditable
                suppressContentEditableWarning
                className="focus-ring mt-3 min-h-28 rounded-md border border-border bg-background/60 p-3 text-sm leading-6"
              >
                Define acceptance criteria, user impact, dependency notes, and release validation for {task.id}.
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background/45 p-4">
                <Clock3 className="size-4 text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Time estimate</p>
                <p className="text-xl font-semibold">{Math.max(2, task.storyPoints)}h</p>
              </div>
              <div className="rounded-lg border border-border bg-background/45 p-4">
                <Route className="size-4 text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Dependencies</p>
                <p className="text-xl font-semibold">2 linked</p>
              </div>
            </section>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

export function KanbanBoard() {
  const tasks = useFlowForgeStore((state) => state.tasks);
  const moveTask = useFlowForgeStore((state) => state.moveTask);
  const [selectedTask, setSelectedTask] = useState<Task | null>(tasks[0] ?? null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const tasksByStatus = useMemo(() => {
    return boardColumns.reduce(
      (acc, column) => {
        acc[column.id] = tasks.filter((task) => task.status === column.id);
        return acc;
      },
      {} as Record<TaskStatus, Task[]>
    );
  }, [tasks]);

  function handleDragEnd(event: DragEndEvent) {
    const overId = event.over?.id;
    if (!overId) return;
    moveTask(String(event.active.id), overId as TaskStatus);
  }

  return (
    <div className="grid gap-5">
      <section className="glass overflow-hidden rounded-lg p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge variant="mint">FlowForge OS</Badge>
            <h2 className="mt-3 text-2xl font-semibold">Adaptive Kanban</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Drag tasks through custom statuses, link focus sessions, and keep sprint context visible without clutter.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="glass">
              <Sparkles />
              AI Breakdown
            </Button>
            <Button>
              <Plus />
              New Task
            </Button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            ["Cycle time", "2.8d"],
            ["Work in progress", "8"],
            ["Blocked", "1"],
            ["Release confidence", "94%"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border bg-background/45 p-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <DndContext id="flowforge-kanban-dnd" sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="soft-scrollbar flex gap-4 overflow-x-auto pb-3">
          {boardColumns.map((column) => (
            <DroppableColumn key={column.id} status={column.id}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <span className={`block h-1.5 w-12 rounded-full bg-gradient-to-r ${column.accent}`} />
                  <h3 className="mt-2 text-sm font-semibold">{column.title}</h3>
                </div>
                <Badge variant="slate">{tasksByStatus[column.id].length}</Badge>
              </div>
              <div className="grid gap-3">
                <AnimatePresence initial={false}>
                  {tasksByStatus[column.id].map((task) => (
                    <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
                  ))}
                </AnimatePresence>
              </div>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>

      <Card>
        <CardHeader>
          <CardTitle>Sprint Swimlanes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {["AI Platform", "Focus Experience", "Workspace Security"].map((lane, index) => (
            <div key={lane} className="rounded-lg border border-border bg-background/40 p-4">
              <FileText className="size-4 text-primary" />
              <p className="mt-3 text-sm font-semibold">{lane}</p>
              <p className="mt-1 text-xs text-muted-foreground">{[18, 11, 7][index]} story points planned</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <TaskInspector task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
