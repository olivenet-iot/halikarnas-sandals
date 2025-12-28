"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminShellProps {
  children: React.ReactNode;
  pendingOrdersCount?: number;
}

export function AdminShell({ children, pendingOrdersCount = 0 }: AdminShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state to localStorage
  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(newState));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        pendingOrdersCount={pendingOrdersCount}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader onMenuClick={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
