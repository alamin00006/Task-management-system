"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import type { TaskStatus, TaskPriority } from "@/types";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

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

const STATUSES: TaskStatus[] = ["To Do", "In Progress", "In Review", "Done"];

export default function AllTasksPage() {
  const { users } = useAuth();
  const { tasks, fetchTasks, assignTask, updateTaskStatus, deleteTask } = useTasks();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const getUserName = (id: string) => users.find((u) => u.id === id)?.name ?? "Unassigned";

  const handleDelete = async () => {
    if (deletingId) { await deleteTask(deletingId); setDeletingId(null); }
  };

  const selectClass = "rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">All Tasks</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Assignee</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-card-foreground">{task.title}</td>
                <td className="px-4 py-3">
                  <select value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)} className={selectClass}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${priorityColor[task.priority]}`}>{task.priority}</span>
                </td>
                <td className="px-4 py-3">
                  <select value={task.assigneeId} onChange={(e) => assignTask(task.id, e.target.value)} className={selectClass}>
                    {users.filter((u) => u.role === "user").map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{task.dueDate}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setDeletingId(task.id)} className="rounded p-1 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-card-foreground">Delete Task</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this task? This action cannot be undone and will be recorded in the audit log.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setDeletingId(null)} className="rounded-md border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted">Cancel</button>
              <button onClick={handleDelete} className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:bg-destructive/90">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
