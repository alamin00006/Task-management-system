export interface AuditTaskAssignee {
  id: string;
  name: string;
  email: string;
}

export interface AuditTaskSnapshot {
  id: string;
  title: string;
  description?: string;
  status?: "Pending" | "Processing" | "Done" | string;
  assignee?: AuditTaskAssignee | null;
  createdAt?: string;
  createdBy?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action:
    | "TASK_CREATED"
    | "TASK_UPDATED"
    | "TASK_DELETED"
    | "STATUS_CHANGED"
    | "ASSIGNMENT_CHANGED"
    | string;
  details: string;
  entity: string;
  entityId: string;
  before?: AuditTaskSnapshot | null;
  after?: AuditTaskSnapshot | null;
}
