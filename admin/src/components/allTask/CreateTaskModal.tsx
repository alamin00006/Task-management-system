"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { useGetUsersQuery } from "@/redux/api/usersApi";
import { useCreateTaskMutation } from "@/redux/api/taskApi";
import Modal from "../shared/Modal";

// shadcn/ui imports
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

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTaskModalProps) {
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setAssigneeId("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!assigneeId) {
      setError("Assignee is required");
      return;
    }

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        assigneeId,
      }).unwrap();

      onClose();
      onSuccess?.();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create task");
    }
  };

  const filteredUsers = users.filter((u: any) => u.role === "user");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
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
            className="focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground">
            A clear, concise title for the task
          </p>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={4}
            disabled={isLoading}
            className="resize-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground">
            Provide additional details, requirements, or context for this task
          </p>
        </div>

        {/* Assignee Field */}
        <div className="space-y-2">
          <Label htmlFor="assignee">
            Assignee <span className="text-destructive">*</span>
          </Label>
          <Select
            value={assigneeId}
            onValueChange={setAssigneeId}
            disabled={usersLoading || isLoading}
          >
            <SelectTrigger
              id="assignee"
              className="focus:ring-2 focus:ring-primary/20 mt-3"
            >
              <SelectValue placeholder="Select a team member" />
            </SelectTrigger>
            <SelectContent>
              {filteredUsers.length === 0 ? (
                <SelectItem value="no-users" disabled>
                  No users available
                </SelectItem>
              ) : (
                filteredUsers.map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <div className="relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        {user.email && (
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>
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

          {!usersLoading && filteredUsers.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No team members available. Please add users first.
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="animate-in fade-in-50 duration-200"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form Actions */}
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
            disabled={isLoading || !title.trim() || !assigneeId}
            className="flex-1"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
