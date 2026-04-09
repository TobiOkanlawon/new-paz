"use client";
import React from "react";
import styles from "./layout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={styles.mainContent}>{children}</main>;
}
