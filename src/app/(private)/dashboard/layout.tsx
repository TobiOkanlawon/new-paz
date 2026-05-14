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
  const isCollapsedByDefault = () => {
    const isMobile = window.innerWidth <= 960;
    return isMobile;
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(isCollapsedByDefault);
  const pathname = usePathname();

  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  // Close sidebar when route changes
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  return (
    <div
      className={clsx(
        styles.pageContainer,
        collapsed && styles.pageContainerCollapsed,
      )}
    >
      <Sidebar
        isOpen={isDropdownOpen}
        collapsed={collapsed}
        action={toggleCollapsed}
      />

      <div className={styles.dashboardMain}>
        <Header />
        <main
          className={styles.mainContent}
          onClick={() => setIsDropdownOpen(false)}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
