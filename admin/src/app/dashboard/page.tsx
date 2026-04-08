"use client";

import { useGetMyTasksQuery, useGetTasksQuery } from "@/redux/api/taskApi";
import { useAppSelector } from "@/redux/hooks/hooks";
import { useMemo } from "react";

const STATUSES = ["Pending", "In Processing", "Done"] as const;

export default function DashboardHome() {
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const {
    data: allTasksResponse,
    isLoading: allTasksLoading,
    isError: allTasksError,
  } = useGetTasksQuery(undefined, {
    skip: !isAdmin,
  });

  const {
    data: myTasksResponse,
    isLoading: myTasksLoading,
    isError: myTasksError,
  } = useGetMyTasksQuery(undefined, {
    skip: isAdmin,
  });

  const tasks = useMemo(() => {
    if (isAdmin) {
      return allTasksResponse?.data ?? [];
    }
    return myTasksResponse ?? [];
  }, [isAdmin, allTasksResponse, myTasksResponse]);

  const isLoading = isAdmin ? allTasksLoading : myTasksLoading;
  const isError = isAdmin ? allTasksError : myTasksError;

  const statusCounts = useMemo(() => {
    return STATUSES.map((status) => ({
      status,
      count: tasks.filter((task) => task.status === status).length,
    }));
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome, {user?.name}
        </h2>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Here's an overview of all tasks."
            : "Here's an overview of your assigned tasks."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statusCounts.map((item) => (
          <div
            key={item.status}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {item.status}
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {item.count}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
        <p className="mt-2 text-3xl font-bold text-card-foreground">
          {tasks.length}
        </p>
      </div>
    </div>
  );
}
