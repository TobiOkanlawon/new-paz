'use client'
import Image from "next/image";
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

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    return ( 
        <>
        <Navbar onToggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} />
        {children}
        </>
    );
}
