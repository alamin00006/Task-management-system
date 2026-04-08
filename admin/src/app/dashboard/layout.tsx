"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  List,
  ScrollText,
  ClipboardList,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { logout } from "@/redux/authSlice";

const adminItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Create Task", url: "/dashboard/create", icon: Plus },
  { title: "All Tasks", url: "/dashboard/tasks", icon: List },
  { title: "Audit Logs", url: "/dashboard/logs", icon: ScrollText },
];

const userItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Tasks", url: "/dashboard/my-tasks", icon: ClipboardList },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { user, token } = useAppSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const items = useMemo(() => {
    return isAdmin ? adminItems : userItems;
  }, [isAdmin]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } flex flex-col border-r border-border bg-card transition-all duration-200`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed ? (
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Task Flow
              </h2>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "Admin Panel" : "User Panel"}
              </p>
            </div>
          ) : (
            <div className="text-sm font-semibold text-foreground">TF</div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {items.map((item) => {
            const active =
              pathname === item.url || pathname.startsWith(`${item.url}/`);

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => router.push(item.url)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div
            className={`mb-3 rounded-lg bg-muted/60 ${
              collapsed ? "p-2 text-center" : "p-3"
            }`}
          >
            {!collapsed ? (
              <>
                <p className="truncate text-sm font-medium text-foreground">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </>
            ) : (
              <Menu className="mx-auto h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {isAdmin ? "Admin Dashboard" : "User Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </p>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
