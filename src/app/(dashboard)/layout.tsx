"use client";
import styles from "./layout.module.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className={styles.body}>
      <Navbar onToggleSidebar={toggleSidebar} />
      <main className={styles.dashboardMain}>
        <Sidebar isOpen={isSidebarOpen} />
        {children}
      </main>
    </div>
  );
}
