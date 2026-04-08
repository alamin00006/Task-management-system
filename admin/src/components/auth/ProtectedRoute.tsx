"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/reduxHook";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();

  const { accessToken, user } = useAppSelector((state) => state.auth);

  const isAuthenticated = !!accessToken && !!user;

  const hasRequiredRole = !requiredRole || user?.role === requiredRole;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!hasRequiredRole) {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, hasRequiredRole, router]);

  if (!isAuthenticated) return null;
  if (!hasRequiredRole) return null;

  return <>{children}</>;
}
