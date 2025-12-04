"use client";
import React from "react";
import styles from "./layout.module.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <>
      <Navbar onToggleSidebar={toggleSidebar} />
      <main className={styles.dashboardMain}>
        <Sidebar isOpen={isSidebarOpen} />
        <div className={styles.content}>{children}</div>
      </main>
    </>
  );
}
