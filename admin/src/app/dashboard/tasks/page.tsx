import AllTask from "@/components/tasks/AllTask";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AllTaskPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AllTask />
    </ProtectedRoute>
  );
}
