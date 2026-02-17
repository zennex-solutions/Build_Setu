import React, { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
  role?: string;
  pageTitle?: string;
  showLogout?: boolean;
  onLogout?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  role = "SUPER_ADMIN",
  pageTitle,
  showLogout = true,
  onLogout 
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
    navigate("/", { replace: true });
  };

  return (
    <div className="h-screen flex bg-[var(--bs-secondary)]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar role={role} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <Sidebar role={role} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-[var(--bs-primary)] text-2xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <h1 className="text-xl font-semibold text-[var(--bs-primary)]">
              {pageTitle}
            </h1>
          </div>
          
          {showLogout && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium hidden sm:inline-block">
                {role}
              </span>
              <button
                className="text-amber-500 hover:underline px-2 py-1"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Content area */}
        <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-y-auto dashboard-container">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;