import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuditLogs from "@/components/auditLogs/AuditLogs";

export default function AuditLogsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AuditLogs />
    </ProtectedRoute>
  );
}
