import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell() {
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const handleOpenSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={handleCloseSidebar}
      />

      <div className="lg:pl-64">
        <Topbar
          onMenuClick={handleOpenSidebar}
        />

        <main className="min-h-[calc(100vh-4rem)]">
          <div className="mx-auto w-full max-w-[1480px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
