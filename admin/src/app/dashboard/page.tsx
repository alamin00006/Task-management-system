"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import type { TaskStatus } from "@/types";
import { useEffect } from "react";

const STATUSES: TaskStatus[] = ["To Do", "In Progress", "In Review", "Done"];

export default function DashboardHome() {
  const { user } = useAuth();
  const { tasks, fetchTasks, fetchMyTasks } = useTasks();

  useEffect(() => {
    if (user?.role === "admin") fetchTasks();
    else fetchMyTasks();
  }, [user, fetchTasks, fetchMyTasks]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h2>
        <p className="text-muted-foreground">
          {user?.role === "admin" ? "Here's an overview of all tasks." : "Here's an overview of your assigned tasks."}
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATUSES.map((status) => {
          const count = tasks.filter((t) => t.status === status).length;
          return (
            <div key={status} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">{status}</p>
              <p className="mt-1 text-2xl font-bold text-card-foreground">{count}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
        <p className="mt-1 text-3xl font-bold text-card-foreground">{tasks.length}</p>
      </div>
    </div>
  );
}
