export interface TaskAssignee {
  id: string;
  name: string;
  email?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignee?: TaskAssignee | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}
