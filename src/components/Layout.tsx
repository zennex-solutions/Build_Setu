import React, { type ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  role: string; // pass user role for sidebar
}

const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  return (
    <div className="flex">
      {/* Sidebar fixed on left */}
      <Sidebar role={role} />

      {/* Main content */}
      <main className="ml-2 flex-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;
