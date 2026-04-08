import { DashboardHeader } from "@/components/layout/DashboardHeader";
import AllTask from "@/components/allTask/AllTask";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <DashboardHeader />
        </div>
        <hr />
        {/* All Task */}
        <AllTask />

        <footer className="text-center text-sm text-muted-foreground py-4 border-t">
          Task Management
        </footer>
      </div>
    </ProtectedRoute>
  );
}
