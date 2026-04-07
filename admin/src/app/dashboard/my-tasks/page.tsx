"use client";
import { useTasks } from "@/contexts/TaskContext";
import type { TaskStatus, TaskPriority } from "@/types";
import { useEffect } from "react";

const STATUSES: TaskStatus[] = ["To Do", "In Progress", "In Review", "Done"];

const priorityColor: Record<TaskPriority, string> = {
  Low: "bg-secondary text-secondary-foreground",
  Medium: "bg-primary/10 text-primary",
  High: "bg-destructive/15 text-destructive",
};

const statusStyle: Record<TaskStatus, string> = {
  "To Do": "bg-muted text-muted-foreground",
  "In Progress": "bg-primary/15 text-primary",
  "In Review": "bg-accent text-accent-foreground",
  "Done": "bg-secondary text-secondary-foreground",
};

export default function MyTasksPage() {
  const { tasks, fetchMyTasks, updateTaskStatus } = useTasks();

  useEffect(() => { fetchMyTasks(); }, [fetchMyTasks]);

  const selectClass = "rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">My Tasks</h2>
      {tasks.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
          No tasks assigned to you.
        </div>
      )}
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-card-foreground">{task.title}</h3>
              <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${priorityColor[task.priority]}`}>{task.priority}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
              <span className={`inline-block rounded px-2 py-1 text-xs ${statusStyle[task.status]}`}>{task.status}</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-foreground">Update Status</span>
              <select value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)} className={selectClass}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
