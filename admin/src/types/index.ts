export type Role = "admin" | "user";
export type TaskStatus = "Pending" | "Processing" | "Done";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  createdBy: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  details: string;
}
