type Role = "admin" | "user" | "all";

type SubMenuItem = {
  label: string;
  href: string;
  role?: Role;
};

export type MenuItem = {
  label: string;
  icon: string;
  href: string;
  role?: Role;
  hasSubmenu?: boolean;
  submenuItems?: SubMenuItem[];
};

export const menuSections: { items: MenuItem[] }[] = [
  {
    items: [
      {
        label: "All Tasks",
        icon: "list",
        href: "/dashboard/tasks",
        role: "admin",
      },
      {
        label: "Audit Logs",
        icon: "shield",
        href: "/dashboard/logs",
        role: "admin",
      },

      {
        label: "My Tasks",
        icon: "check-square",
        href: "/dashboard/my-tasks",
        role: "user",
      },
      {
        label: "Profile",
        icon: "users",
        href: "/dashboard/profile",
        role: "user",
      },
    ],
  },
];
