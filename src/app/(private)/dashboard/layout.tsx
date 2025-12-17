"use client";
import React from "react";
import styles from "./layout.module.css";
import Navbar from "@/components/Navbar";
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
    <>
      <Navbar onToggleSidebar={toggleSidebar} />
      <main className={styles.dashboardMain}>
        <Sidebar isOpen={isSidebarOpen} />
        <div 
          className={styles.content}
          onClick={() => setIsSidebarOpen(false)}
        >
          {children}
        </div>
      </main>
    </>
  );
}
