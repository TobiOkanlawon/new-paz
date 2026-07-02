"use client";
import React from "react";
import styles from "./layout.module.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProfileHydrator from "@/components/ProfileHydrator";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleCollapsed = () => setCollapsed((prev) => !prev);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  useEffect(() => {
    setCollapsed(window.innerWidth <= 960);
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div
      className={clsx(
        styles.pageContainer,
        collapsed && styles.pageContainerCollapsed,
      )}
    >
      <ProfileHydrator />
      <Sidebar
        isOpen={isDropdownOpen}
        collapsed={collapsed}
        action={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {mobileOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={styles.dashboardMain}>
        <Header onMenuClick={toggleMobile} />
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
