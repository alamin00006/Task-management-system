"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useGetUsersQuery } from "@/redux/api/usersApi";
import { useCreateTaskMutation } from "@/redux/api/taskApi";

export default function CreateTaskPage() {
  const router = useRouter();

  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title) {
      setError("Title is required");
      return;
    }

    if (!assigneeId) {
      setError("Assignee is required");
      return;
    }

    try {
      await createTask({
        title,
        description,
        assigneeId,
      }).unwrap();

      router.push("/dashboard/tasks");
    } catch (err: any) {
      console.log(err);
      setError(err?.data?.message || "Failed to create task");
    }
  };

  const inputClass =
    "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Create New Task</h2>
        <p className="text-sm text-muted-foreground">
          Assign a new task to a team member.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Assignee
            </label>

            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className={inputClass}
              disabled={usersLoading}
            >
              <option value="">Select user</option>

              {users
                .filter((u) => u.role === "user")
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
