"use client";

import {
  useGetMyTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/redux/api/taskApi";

import { ClipboardList, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "../shared/DataTable";

const STATUSES = ["Pending", "Processing", "Done"];

const statusVariantClass: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Processing: "bg-blue-100 text-blue-800 border-blue-200",
  Done: "bg-green-100 text-green-800 border-green-200",
};

export default function MyTasks() {
  const { data: tasks = [], isLoading, isError } = useGetMyTasksQuery();

  const [updateTaskStatus, { isLoading: isUpdating }] =
    useUpdateTaskStatusMutation();

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTaskStatus({ id: taskId, status }).unwrap();
      toast.success("Task status updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update task status");
    }
  };

  const columns = [
    {
      title: "Task",
      key: "title",
      render: (row: any) => <div className="font-medium">{row.title}</div>,
    },
    {
      title: "Description",
      key: "description",
      render: (row: any) => (
        <span className="text-sm text-muted-foreground">
          {row.description || "No description"}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (row: any) => (
        <Badge
          variant="outline"
          className={
            statusVariantClass[row.status] ||
            "border-muted bg-muted text-muted-foreground"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      title: "Created At",
      key: "createdAt",
      render: (row: any) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      title: "Update Status",
      key: "action",
      render: (row: any) => (
        <div>
          <Select
            value={row.status}
            onValueChange={(value) => handleStatusChange(row.id, value)}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isUpdating && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Updating...
            </div>
          )}
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
        Failed to load your tasks.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Tasks</h2>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border px-6 py-14 text-center">
          <ClipboardList className="mb-3 h-6 w-6 text-muted-foreground" />
          <p>No tasks assigned</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <DataTable
              columns={columns}
              data={tasks}
              loading={isLoading}
              showRowNumbers
              emptyMessage="No tasks found"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
