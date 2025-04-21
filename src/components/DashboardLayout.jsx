import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen bg-gray-100"
      style={{
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          height: "100dvh",
        }}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
      </div>
      {/* Main content */}
      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main
          className="p-6"
          style={{
            height: "100dvh",
            overflow:"scroll"
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
