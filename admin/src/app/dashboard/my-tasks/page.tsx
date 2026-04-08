"use client";

import {
  useGetMyTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/redux/api/taskApi";
import { ClipboardList } from "lucide-react";

const STATUSES = ["Pending", "In Processing", "Done"];

const statusStyle: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground",
  "In Processing": "bg-primary/10 text-primary",
  Done: "bg-secondary text-secondary-foreground",
};

export default function MyTasksPage() {
  const { data: tasks = [], isLoading, isError } = useGetMyTasksQuery();

  const [updateTaskStatus, { isLoading: isUpdating }] =
    useUpdateTaskStatusMutation();

  const selectClass =
    "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
        Loading your tasks...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
        Failed to load your tasks.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Tasks</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View your assigned tasks and update their status.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
          <p className="text-xs text-muted-foreground">Assigned Tasks</p>
          <p className="text-2xl font-bold text-card-foreground">
            {tasks.length}
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-12 text-center shadow-sm">
          <div className="mb-4 rounded-full bg-muted p-3">
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">
            No tasks assigned
          </h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            You do not have any assigned tasks right now. Once a task is
            assigned to you, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {task.title}
                  </h3>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {task.description || "No description provided."}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    statusStyle[task.status] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <div className="mt-5 grid gap-4 border-t border-border pt-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Created At
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Task ID
                  </p>
                  <p className="mt-1 text-sm text-foreground">{task.id}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Update Status
                  </p>
                  <select
                    value={task.status}
                    disabled={isUpdating}
                    onChange={(e) =>
                      updateTaskStatus({
                        id: task.id,
                        status: e.target.value,
                      })
                    }
                    className={`${selectClass} mt-1 w-full`}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
