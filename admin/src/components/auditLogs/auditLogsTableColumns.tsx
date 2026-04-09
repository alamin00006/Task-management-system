"use client";

import { AuditLog } from "@/types/audit";
import { Button } from "@/components/ui/button";

type Column<T> = {
  title: string;
  key: string;
  render?: (row: T) => React.ReactNode;
};

const actionColors: Record<string, string> = {
  TASK_CREATED: "text-green-600 bg-green-100",
  TASK_UPDATED: "text-blue-600 bg-blue-100",
  TASK_DELETED: "text-red-600 bg-red-100",
  STATUS_CHANGED: "text-yellow-600 bg-yellow-100",
  ASSIGNMENT_CHANGED: "text-purple-600 bg-purple-100",
};

interface GetAuditLogColumnsProps {
  onView: (log: AuditLog) => void;
}

export const getAuditLogColumns = ({
  onView,
}: GetAuditLogColumnsProps): Column<AuditLog>[] => [
  {
    key: "timestamp",
    title: "Time",
    render: (row) => <span>{new Date(row.timestamp).toLocaleString()}</span>,
  },
  {
    key: "userName",
    title: "User",
    render: (row) => (
      <span className="px-2 py-1 border rounded text-xs">{row.userName}</span>
    ),
  },
  {
    key: "action",
    title: "Action",
    render: (row) => {
      const action = row.action;
      return (
        <span
          className={`px-2 py-1 rounded text-xs ${
            actionColors[action] || "bg-muted text-foreground"
          }`}
        >
          {action.replace(/_/g, " ")}
        </span>
      );
    },
  },
  {
    key: "details",
    title: "Details",
    render: (row) => (
      <span className="text-muted-foreground">{row.details}</span>
    ),
  },
  {
    key: "changes",
    title: "Changes",
    render: (row) => {
      if (!row.before && !row.after) {
        return <span className="text-xs text-muted-foreground">—</span>;
      }

      return (
        <Button variant="outline" size="sm" onClick={() => onView(row)}>
          View
        </Button>
      );
    },
  },
];
