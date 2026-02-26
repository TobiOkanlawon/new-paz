"use client";
import React from "react";
import styles from "./layout.module.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={styles.pageContainer}>
      <Sidebar isOpen={isSidebarOpen} />

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
