import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MyTasks from "@/components/myTask/MyTasks";

export default function Page() {
  return (
    <ProtectedRoute requiredRole="user">
      <MyTasks />
    </ProtectedRoute>
  );
}
