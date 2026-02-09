import React from "react";

interface SidebarProps {
  role: string; // user's role
}

interface SidebarLink {
  name: string;
  href: string;
  icon: string;
  roles: string[]; // roles that can see this link
}

// Define all sidebar links with role-based access
const allSidebarLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: "🏠", roles: ["SUPER_ADMIN","PROJECT_MANAGER","SITE_ENGINEER","SUPERVISOR","ACCOUNTANT","CONTRACTOR","CLIENT"] },
  { name: "Projects", href: "/projects", icon: "📁", roles: ["SUPER_ADMIN","PROJECT_MANAGER","SITE_ENGINEER","SUPERVISOR","CLIENT"] },
  { name: "Teams", href: "/teams", icon: "👷", roles: ["SUPER_ADMIN","PROJECT_MANAGER","SITE_ENGINEER","SUPERVISOR"] },
  { name: "Reports", href: "/reports", icon: "📊", roles: ["SUPER_ADMIN","ACCOUNTANT","PROJECT_MANAGER"] },
  { name: "User Approvals", href: "/userapproval", icon: "✅", roles: ["SUPER_ADMIN"] }, // only Super Admin
  { name: "Users", href: "/users", icon: "👷", roles: ["SUPER_ADMIN"] },
   { name: "Material Details", href: "/material-page", icon: "👷", roles: ["SUPER_ADMIN"] },
    { name: "Labour Details", href: "/labour-page", icon: "👷", roles: ["SUPER_ADMIN","PROJECT_MANAGER","SITE_ENGINEER","SUPERVISOR"] },
    { name: "Supplier Details", href: "/suppliers", icon: "👷", roles: ["SUPER_ADMIN","PROJECT_MANAGER","SITE_ENGINEER","SUPERVISOR"] },
    { name: "Messages", href: "/messages", icon: "👷", roles: ["SUPER_ADMIN","PROJECT_MANAGER","SITE_ENGINEER","SUPERVISOR"] },
    { name: "Variations", href: "/variations", icon: "👷", roles: ["SUPER_ADMIN","PROJECT_MANAGER","SITE_ENGINEER","SUPERVISOR"] }
];

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  // Filter links based on role
  const sidebarLinks = allSidebarLinks.filter(link => link.roles.includes(role));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-[var(--bs-primary)] mb-8">
        Build<span className="text-amber-500">Setu</span>
      </h2>
      <nav className="flex flex-col space-y-4">
        {sidebarLinks.map(({ name, href, icon }) => (
          <a
            key={name}
            href={href}
            className="flex items-center space-x-3 text-gray-700 hover:text-[var(--bs-primary)] font-medium"
          >
            <span className="text-xl">{icon}</span>
            <span>{name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
