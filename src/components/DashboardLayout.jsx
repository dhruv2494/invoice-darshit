// DashboardLayout.jsx
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main
          className="p-4 overflow-auto"
          style={{ height: "90dvh" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
