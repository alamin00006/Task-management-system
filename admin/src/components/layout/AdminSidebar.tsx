"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  List,
  Shield,
  Users,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils/cnMerge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRole } from "@/hooks/useRole";
import { MenuItem, menuSections } from "@/lib/utils/Menu";

const iconMap: Record<string, React.ElementType> = {
  list: List,
  shield: Shield,
  users: Users,
  "check-square": CheckSquare,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface FilteredSection {
  items: MenuItem[];
}

function SidebarLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (href === "#") {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function hasAccess(role: string | undefined, isAdmin: boolean) {
  if (!role || role === "all") return true;
  if (role === "admin") return isAdmin;
  if (role === "user") return !isAdmin;
  return false;
}

function isPathActive(pathname: string, href: string) {
  if (href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ collapsed, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { isAdmin } = useRole();

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const filteredMenuSections = useMemo<FilteredSection[]>(() => {
    const query = searchQuery.trim().toLowerCase();

    return menuSections
      .map((section) => {
        const items = section.items
          .map((item) => {
            if (!hasAccess(item.role, isAdmin)) return null;

            const hasChildren = !!item.submenuItems?.length;

            if (!hasChildren) {
              const matchesSearch =
                !query || item.label.toLowerCase().includes(query);
              return matchesSearch ? item : null;
            }

            const filteredChildren = (item.submenuItems || []).filter(
              (subItem) => {
                const roleMatched = hasAccess(subItem.role, isAdmin);
                const searchMatched =
                  !query || subItem.label.toLowerCase().includes(query);

                return roleMatched && searchMatched;
              },
            );

            const parentMatchesSearch =
              !query || item.label.toLowerCase().includes(query);

            if (!parentMatchesSearch && filteredChildren.length === 0) {
              return null;
            }

            return {
              ...item,
              submenuItems: filteredChildren,
            };
          })
          .filter(Boolean) as MenuItem[];

        if (items.length === 0) return null;

        return { items };
      })
      .filter(Boolean) as FilteredSection[];
  }, [isAdmin, searchQuery]);

  const renderMenuItem = (item: MenuItem, collapsedView = false) => {
    const Icon = iconMap[item.icon] || List;
    const isExpanded = expandedItems.includes(item.label);
    const isActive = isPathActive(pathname, item.href);

    if (item.hasSubmenu) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpanded(item.label)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
              collapsedView && "justify-center",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsedView && (
              <>
                <span className="flex-1 text-left text-sm">{item.label}</span>
                <span className="text-sidebar-foreground/50">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </span>
              </>
            )}
          </button>

          {!collapsedView && isExpanded && item.submenuItems && (
            <div className="ml-7 mt-1 space-y-0.5">
              {item.submenuItems.map((subItem) => (
                <SidebarLink
                  key={subItem.label}
                  href={subItem.href}
                  className={cn(
                    "block px-3 py-1.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
                    isPathActive(pathname, subItem.href) &&
                      "bg-sidebar-accent text-sidebar-foreground",
                  )}
                >
                  {subItem.label}
                </SidebarLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <SidebarLink
        key={item.label}
        href={item.href}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
          collapsedView && "justify-center",
          isActive && "bg-sidebar-accent text-sidebar-foreground",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsedView && (
          <span className="flex-1 text-left text-sm">{item.label}</span>
        )}
      </SidebarLink>
    );
  };

  if (isMobile) {
    return (
      <>
        {!collapsed && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={onToggle} />
        )}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300",
            collapsed ? "-translate-x-full" : "translate-x-0",
          )}
        >
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                <span className="text-primary">Sera</span>gari
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 text-sidebar-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {isAdmin && (
            <div className="mb-2 px-3">
              <SidebarLink
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-md bg-sidebar-primary px-3 py-2.5 font-medium text-sidebar-primary-foreground",
                  isPathActive(pathname, "/dashboard") &&
                    "bg-sidebar-accent text-sidebar-foreground",
                )}
              >
                <LayoutDashboard className="h-5 w-5 shrink-0" />
                <span>Dashboard</span>
              </SidebarLink>
            </div>
          )}

          <ScrollArea className="flex-1 px-3">
            <div className="space-y-4 pb-4">
              {filteredMenuSections.map((section, index) => (
                <div key={index}>
                  <div className="space-y-0.5">
                    {section.items.map((item) => renderMenuItem(item))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-lg bg-sidebar-primary p-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-primary text-sm text-primary-foreground">
                  JD
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  Jhon Doe
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60">
                  g*******@admin.com
                </p>
              </div>

              <ChevronDown className="h-4 w-4 shrink-0 text-sidebar-foreground/60" />
            </div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col bg-sidebar pt-3 text-sidebar-foreground transition-all duration-300 lg:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {!collapsed && (
        <div className="flex items-center justify-center gap-2 pt-5 pb-8">
          <span className="text-xl font-bold">
            <span className="text-primary">Task</span>Management
          </span>
        </div>
      )}

      {isAdmin && (
        <div className="mb-2 px-3">
          <SidebarLink
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-md bg-sidebar-primary px-3 py-2.5 font-medium text-sidebar-primary-foreground",
              collapsed && "justify-center",
              isPathActive(pathname, "/dashboard") &&
                "bg-sidebar-accent text-sidebar-foreground",
            )}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </SidebarLink>
        </div>
      )}

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-4 pb-4">
          {filteredMenuSections.map((section, index) => (
            <div key={index}>
              <div className="space-y-0.5">
                {section.items.map((item) => renderMenuItem(item, collapsed))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div
        className={cn(
          "border-t border-sidebar-border p-3",
          collapsed && "px-2",
        )}
      ></div>
    </aside>
  );
}
