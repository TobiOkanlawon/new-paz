"use client";
import React, { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { removeToken } from "@/libs/auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Keep QueryClient stable between renders
  const queryClientRef = useRef<QueryClient | undefined>(undefined);
  if (!queryClientRef.current) queryClientRef.current = new QueryClient();
  const queryClient = queryClientRef.current!;

  useEffect(() => {
    const handleLogout = () => {
      removeToken();
      queryClient.removeQueries();
      router.replace("/login");
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
      {children}
    </QueryClientProvider>
  );
}
