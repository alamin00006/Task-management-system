import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuditLogsPage from "@/components/logs/Logs";

export default function Page() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AuditLogsPage />
    </ProtectedRoute>
  );
}
