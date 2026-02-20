"use client";
import useToken from "@/store/tokenStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const publicRoutes = ["/", "/login", "register", "/forgot-password", "/reset-password"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useToken();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (token && publicRoutes.includes(pathname)) {
      router.replace("/dashboard");
    }
  }, [token, router, pathname]);

  if (token) {
    return null;
  }

  return <>{children}</>;
}
