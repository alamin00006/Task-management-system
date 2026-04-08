"use client";

import Pagination from "@/app/common/Pagination";
import { useGetAuditLogsQuery } from "@/redux/api/auditApi";
import { useState } from "react";

const ACTION_TYPES = [
  "TASK_CREATED",
  "TASK_UPDATED",
  "TASK_DELETED",
  "STATUS_CHANGED",
  "ASSIGNMENT_CHANGED",
];

const actionColors: Record<string, string> = {
  TASK_CREATED: "text-green-600 bg-green-100",
  TASK_UPDATED: "text-blue-600 bg-blue-100",
  TASK_DELETED: "text-red-600 bg-red-100",
  STATUS_CHANGED: "text-yellow-600 bg-yellow-100",
  ASSIGNMENT_CHANGED: "text-purple-600 bg-purple-100",
};

function DiffView({ before, after }: any) {
  if (!before && !after) {
    return (
      <p className="text-sm text-muted-foreground">No changes recorded.</p>
    );
  }

  const keys = Array.from(
    new Set([...Object.keys(before || {}), ...Object.keys(after || {})]),
  ).filter((k) => !["id", "createdAt", "createdBy"].includes(k));

  return (
    <div className="space-y-2 mt-3">
      {keys.map((key) => {
        const b = before?.[key];
        const a = after?.[key];
        const changed = JSON.stringify(b) !== JSON.stringify(a);

        return (
          <div
            key={key}
            className={`rounded-md p-2 text-sm ${changed ? "bg-muted" : ""}`}
          >
            <span className="font-medium capitalize">{key}</span>

            {changed ? (
              <div className="ml-3">
                <p className="text-red-500 line-through">
                  - {String(b ?? "—")}
                </p>
                <p className="text-green-600">+ {String(a ?? "—")}</p>
              </div>
            ) : (
              <span className="ml-2 text-muted-foreground">
                {String(a ?? b ?? "—")}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const { data, isLoading } = useGetAuditLogsQuery({
    page,
    limit: 10,
    search: actionFilter || undefined,
  });

  const logs = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Audit Logs</h2>
          <p className="text-sm text-muted-foreground">
            Track all system activities
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {meta?.total || 0} logs
        </span>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={actionFilter}
          onChange={(e) => {
            setPage(1);
            setActionFilter(e.target.value);
          }}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Actions</option>
          {ACTION_TYPES.map((a) => (
            <option key={a} value={a}>
              {a.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Details</th>
              <th className="p-3 text-left">Diff</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            )}

            {!isLoading && logs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No logs found
                </td>
              </tr>
            )}

            {logs.map((log: any) => (
              <tr key={log.id} className="border-t">
                <td className="p-3">
                  {new Date(log.timestamp).toLocaleString()}
                </td>

                <td className="p-3">
                  <span className="px-2 py-1 border rounded text-xs">
                    {log.userName}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      actionColors[log.action] || "bg-muted"
                    }`}
                  >
                    {log.action.replace(/_/g, " ")}
                  </span>
                </td>

                <td className="p-3 text-muted-foreground">{log.details}</td>

                <td className="p-3">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="text-primary hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-card p-6 rounded-xl w-full max-w-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">
              {selectedLog.action.replace(/_/g, " ")}
            </h3>

            <DiffView before={selectedLog.before} after={selectedLog.after} />

            <button
              onClick={() => setSelectedLog(null)}
              className="mt-4 px-4 py-2 border rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
