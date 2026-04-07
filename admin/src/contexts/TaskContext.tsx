"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Task, AuditLogEntry, TaskStatus } from "@/types";

interface TaskContextType {
  tasks: Task[];
  auditLog: AuditLogEntry[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  fetchMyTasks: () => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  createTask: (data: { title: string; description: string; priority: string; assigneeId: string; dueDate: string }) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  assignTask: (taskId: string, assigneeId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try { setTasks(await api.getTasks() as Task[]); } finally { setLoading(false); }
  }, []);

  const fetchMyTasks = useCallback(async () => {
    setLoading(true);
    try { setTasks(await api.getMyTasks() as Task[]); } finally { setLoading(false); }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try { setAuditLog(await api.getAuditLogs() as AuditLogEntry[]); } finally { setLoading(false); }
  }, []);

  const createTask = useCallback(async (data: { title: string; description: string; priority: string; assigneeId: string; dueDate: string }) => {
    await api.createTask(data); await fetchTasks();
  }, [fetchTasks]);

  const updateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
    await api.updateTaskStatus(taskId, status); await fetchTasks();
  }, [fetchTasks]);

  const assignTask = useCallback(async (taskId: string, assigneeId: string) => {
    await api.assignTask(taskId, assigneeId); await fetchTasks();
  }, [fetchTasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    await api.deleteTask(taskId); await fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider value={{ tasks, auditLog, loading, fetchTasks, fetchMyTasks, fetchAuditLogs, createTask, updateTaskStatus, assignTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
