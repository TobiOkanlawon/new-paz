"use client";
import React from "react";
import styles from "./layout.module.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={clsx(styles.pageContainer, collapsed && styles.pageContainerCollapsed)}>
      <Sidebar isOpen={isSidebarOpen} collapsed={collapsed} onToggle={toggleCollapsed} />

      <div className={styles.dashboardMain}>
        <Header />
        <main
          className={styles.mainContent}
          onClick={() => setIsSidebarOpen(false)}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
