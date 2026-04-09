"use client";

import { AuditLog, AuditTaskSnapshot } from "@/types/audit";
import Modal from "../shared/Modal";
import { Clock, User, FileText, Tag, ArrowLeftRight } from "lucide-react";

interface AuditLogDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: AuditLog | null;
}

function formatLabel(key: string) {
  const labels: Record<string, string> = {
    title: "Title",
    description: "Description",
    status: "Status",
    assignee: "Assignee",
    action: "Action",
    userName: "User",
    entity: "Entity",
    details: "Details",
    priority: "Priority",
    dueDate: "Due Date",
  };

  return (
    labels[key] ||
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  );
}

function getActionIcon(action: string) {
  switch (action) {
    case "TASK_CREATED":
      return <FileText className="w-4 h-4 text-green-500" />;
    case "TASK_UPDATED":
      return <ArrowLeftRight className="w-4 h-4 text-blue-500" />;
    default:
      return <Tag className="w-4 h-4 text-gray-500" />;
  }
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  // Handle assignee object - show beautifully
  if (typeof value === "object" && !Array.isArray(value) && value !== null) {
    if ("name" in value) {
      const name = (value as any).name;
      const colors = [
        "bg-red-100",
        "bg-blue-100",
        "bg-green-100",
        "bg-purple-100",
        "bg-pink-100",
        "bg-orange-100",
      ];
      const colorIndex = name?.length % colors.length;

      return (
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full ${colors[colorIndex]} flex items-center justify-center`}
          >
            <span className="text-sm font-semibold text-gray-700">
              {name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">{name}</p>
            {(value as any).email && (
              <p className="text-xs text-muted-foreground">
                {(value as any).email}
              </p>
            )}
          </div>
        </div>
      );
    }

    // Handle status field specially
    if ("status" in value) {
      const status = (value as any).status;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
        >
          {status}
        </span>
      );
    }
  }

  // Handle status as string
  if (
    typeof value === "string" &&
    ["Pending", "In Progress", "Completed", "Cancelled"].includes(value)
  ) {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}
      >
        {value}
      </span>
    );
  }

  if (
    typeof value === "string" &&
    (value.includes("TASK_") || value.includes("USER_"))
  ) {
    return (
      <div className="flex items-center gap-2">
        {getActionIcon(value)}
        <span>{value.replace(/_/g, " ")}</span>
      </div>
    );
  }

  return <span>{String(value)}</span>;
}

function removeUnwantedFields(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => removeUnwantedFields(item));
  }

  const unwantedFields = [
    "id",
    "userId",
    "entityId",
    "createdAt",
    "updatedAt",
    "timestamp",
    "createdBy",
  ];

  const cleaned: any = {};

  Object.keys(obj).forEach((key) => {
    if (!unwantedFields.includes(key)) {
      if (obj[key] && typeof obj[key] === "object") {
        cleaned[key] = removeUnwantedFields(obj[key]);
      } else {
        cleaned[key] = obj[key];
      }
    }
  });

  return cleaned;
}

function SnapshotCard({
  title,
  data,
}: {
  title: string;
  data?: AuditTaskSnapshot | null;
}) {
  const cleanedData = data ? removeUnwantedFields(data) : null;
  const entries = cleanedData ? Object.entries(cleanedData) : [];

  // Filter out unwanted fields from entries
  const filteredEntries = entries.filter(
    ([key]) =>
      ![
        "id",
        "userId",
        "entityId",
        "createdAt",
        "updatedAt",
        "timestamp",
        "createdBy",
      ].includes(key),
  );

  return (
    <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-100">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <div
          className={`w-1 h-6 rounded-full ${title === "Before" ? "bg-orange-400" : "bg-green-400"}`}
        />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      {filteredEntries.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No changes detected
        </p>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map(([key, value]) => (
            <div key={key} className="group">
              <div className="text-xs font-medium text-gray-500 mb-1">
                {formatLabel(key)}
              </div>
              <div className="text-sm">{renderValue(value)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AuditLogDetailsModal({
  open,
  onOpenChange,
  log,
}: AuditLogDetailsModalProps) {
  const cleanedLog = log ? removeUnwantedFields(log) : null;

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Audit Log Details"
      size="xl"
    >
      {!cleanedLog ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No log selected</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Card with Main Info */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getActionIcon(cleanedLog.action)}
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {cleanedLog.entity}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {cleanedLog.action?.replace(/_/g, " ")}
                </h2>
                {cleanedLog.details && (
                  <p className="text-sm text-gray-600 mt-1">
                    {cleanedLog.details}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {cleanedLog.userName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Before and After Comparison */}
          <div className="grid gap-5 md:grid-cols-2">
            <SnapshotCard title="Before" data={cleanedLog.before} />
            <SnapshotCard title="After" data={cleanedLog.after} />
          </div>

          {/* Show what changed if fields are different */}
          {cleanedLog.before && cleanedLog.after && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
                Changes Summary
              </p>
              <div className="space-y-1">
                {Object.keys(cleanedLog.after).map((key) => {
                  if (
                    JSON.stringify(cleanedLog.before?.[key]) !==
                    JSON.stringify(cleanedLog.after?.[key])
                  ) {
                    return (
                      <div key={key} className="text-sm">
                        <span className="font-medium text-gray-700">
                          {formatLabel(key)}:
                        </span>
                        <span className="text-gray-500 ml-2">was</span>
                        <span className="text-red-600 line-through ml-1">
                          {typeof cleanedLog.before?.[key] === "object"
                            ? (cleanedLog.before?.[key] as any)?.name || "—"
                            : String(cleanedLog.before?.[key] || "—")}
                        </span>
                        <span className="text-gray-500 mx-2">→</span>
                        <span className="text-green-600 font-medium">
                          {typeof cleanedLog.after?.[key] === "object"
                            ? (cleanedLog.after?.[key] as any)?.name || "—"
                            : String(cleanedLog.after?.[key] || "—")}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
