"use client";

import { useMemo, useState } from "react";
import { Trash2, Pencil, Plus, RefreshCw } from "lucide-react";

import { useDeleteTaskMutation, useGetTasksQuery } from "@/redux/api/taskApi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import DataTable from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { TaskItem } from "@/types/task";
import CreateTaskModal from "./CreateTaskModal";
import UpdateTaskModal from "./UpdateTaskModal";
import { formatDateTime } from "@/lib/utils/formatDate";
import { setPage } from "@/redux/paginationSlice";

export default function AllTask() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { page, size } = useAppSelector((state) => state.pagination);

  const { data, isLoading, refetch, isFetching } = useGetTasksQuery({
    page,
    limit: size,
  });

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const tasks: TaskItem[] = data?.data || [];
  const meta = data?.meta;

  const taskStats = useMemo(() => {
    return {
      total: meta?.total || 0,
      pending: tasks.filter((task) => task.status === "Pending").length,
      processing: tasks.filter((task) => task.status === "Processing").length,
      done: tasks.filter((task) => task.status === "Done").length,
    };
  }, [tasks, meta]);

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteTask(deletingId).unwrap();

      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });

      setIsDeleteModalOpen(false);
      setDeletingId(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (task: TaskItem) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Task list has been updated.",
      duration: 2000,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      Pending: { variant: "secondary", label: "Pending" },
      Processing: { variant: "default", label: "Processing" },
      Done: { variant: "outline", label: "Done" },
    };

    const config = statusConfig[status] || {
      variant: "secondary" as const,
      label: status,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = [
    {
      title: "Title",
      key: "title",
      render: (row: TaskItem) => <div className="font-medium">{row.title}</div>,
    },
    {
      title: "Assignee",
      key: "assignee",
      render: (row: TaskItem) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xs font-semibold text-primary">
              {row.assignee?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">
              {row.assignee?.name || "Unassigned"}
            </p>
            {row.assignee?.email && (
              <p className="text-xs text-muted-foreground">
                {row.assignee.email}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (row: TaskItem) => getStatusBadge(row.status),
    },
    {
      title: "Created At",
      key: "createdAt",
      render: (row: TaskItem) => formatDateTime(row.createdAt || ""),
    },
    {
      title: "Updated At",
      key: "updatedAt",
      render: (row: TaskItem) => formatDateTime(row.updatedAt || ""),
    },
    {
      title: "Actions",
      key: "actions",
      render: (row: TaskItem) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(row.id)}
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const showEmptyState = !isLoading && tasks.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track all tasks across your team
            <span className="ml-2 text-xs">
              (Total {meta?.total || 0} tasks)
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      {!showEmptyState && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.total}</div>
              <p className="text-xs text-muted-foreground">Across all pages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Waiting to be started
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.processing}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Done</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.done}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {!showEmptyState && (
        <Card>
          <CardContent className="p-0">
            <DataTable columns={columns} data={tasks} loading={isLoading} />
          </CardContent>
        </Card>
      )}
      {/* Pagination */}

      <Pagination
        page={meta?.page ?? 1}
        totalPages={meta?.totalPages ?? 1}
        onPageChange={(p) => dispatch(setPage(p))}
      />

      {showEmptyState && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">
                No tasks yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first task
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsCreateModalOpen(false);
          toast({
            title: "Task created",
            description: "New task has been successfully created.",
          });
        }}
      />

      <UpdateTaskModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSuccess={() => {
          refetch();
          setIsUpdateModalOpen(false);
          setSelectedTask(null);
          toast({
            title: "Task updated",
            description: "Task has been successfully updated.",
          });
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
