"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";

import { useGetUsersQuery } from "@/redux/api/usersApi";
import Modal from "../shared/Modal";
import {
  useUpdateTaskMutation,
  useAssignTaskMutation,
} from "@/redux/api/taskApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserItem {
  id: string;
  name: string;
  email?: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "Pending" | "Processing" | "Done";
  assignee?: {
    id: string;
    name: string;
    email?: string;
  } | null;
}

interface UpdateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | any;
  onSuccess?: () => void;
}

export default function UpdateTaskModal({
  isOpen,
  onClose,
  task,
  onSuccess,
}: UpdateTaskModalProps) {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();
  const [assignTask, { isLoading: isAssigningTask }] = useAssignTaskMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title);
      setDescription(task.description || "");
      setAssigneeId(task.assignee?.id || "");
      setError("");
    }
  }, [task, isOpen]);

  const isLoading = isUpdatingTask || isAssigningTask;

  const filteredUsers = useMemo(
    () => (users as UserItem[]).filter((u) => u.role === "user"),
    [users],
  );

  const selectedAssignee = useMemo(() => {
    // First try to find in filtered users
    const fromFiltered = filteredUsers.find((u) => u.id === assigneeId);
    if (fromFiltered) return fromFiltered;

    // Fallback to task.assignee if available (handles role mismatch or loading)
    if (task?.assignee?.id === assigneeId) {
      return {
        id: task.assignee.id,
        name: task.assignee.name,
        email: task.assignee.email,
      } as UserItem;
    }

    return null;
  }, [filteredUsers, assigneeId, task]);

  const hasChanges =
    !!task &&
    (title.trim() !== task.title ||
      description.trim() !== (task.description || "") ||
      assigneeId !== (task.assignee?.id || ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!task) return;

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!assigneeId) {
      setError("Assignee is required");
      return;
    }

    try {
      const promises = [];

      if (
        title.trim() !== task.title ||
        description.trim() !== (task.description || "")
      ) {
        promises.push(
          updateTask({
            id: task.id,
            title: title.trim(),
            description: description.trim(),
          }).unwrap(),
        );
      }

      if (assigneeId !== (task.assignee?.id || "")) {
        promises.push(
          assignTask({
            id: task.id,
            assigneeId,
          }).unwrap(),
        );
      }

      if (promises.length === 0) {
        onClose();
        return;
      }

      await Promise.all(promises);

      onClose();
      onSuccess?.();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to update task");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Task" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            rows={4}
            disabled={isLoading}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Assignee <span className="text-destructive">*</span>
          </Label>

          <Select
            key={assigneeId} // Force re-render on selection change
            value={assigneeId}
            onValueChange={setAssigneeId}
            disabled={usersLoading || isLoading}
          >
            <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select a team member">
                {usersLoading && assigneeId
                  ? "Loading team member..."
                  : selectedAssignee
                    ? `${selectedAssignee.name}${
                        selectedAssignee.email
                          ? ` (${selectedAssignee.email})`
                          : ""
                      }`
                    : "Select a team member"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {filteredUsers.length === 0 ? (
                <SelectItem value="no-users" disabled>
                  No users available
                </SelectItem>
              ) : (
                filteredUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                    {user.email ? ` (${user.email})` : ""}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {usersLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Loading team members...</span>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !title || !assigneeId || !hasChanges}
            className="flex-1"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Updating..." : "Update Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
