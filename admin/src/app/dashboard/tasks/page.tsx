import AllTask from "@/components/allTask/AllTask";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AllTask />
    </ProtectedRoute>
  );
}
