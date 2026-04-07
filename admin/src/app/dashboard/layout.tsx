"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Plus, List, ScrollText, ClipboardList, LogOut, Menu } from "lucide-react";
import { useState } from "react";

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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-foreground">Loading...</div>;
  if (!user) { router.replace("/login"); return null; }

  const items = user.role === "admin" ? adminItems : userItems;

  const handleLogout = () => { logout(); router.push("/login"); };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-56"} flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200`}>
        <div className="flex items-center justify-between p-4">
          {!collapsed && <span className="text-sm font-semibold text-sidebar-foreground">{user.role === "admin" ? "Admin Panel" : "User Panel"}</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="rounded p-1 text-sidebar-foreground hover:bg-sidebar-accent">
            <Menu className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {items.map((item) => {
            const active = pathname === item.url;
            return (
              <button key={item.title} onClick={() => router.push(item.url)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`}>
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          {!collapsed && user && <p className="mb-2 truncate text-xs text-muted-foreground">{user.name}</p>}
          <button onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50">
            <LogOut className="h-4 w-4" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
