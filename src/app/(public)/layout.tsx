"use client";
import useToken from "@/store/tokenStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const publicRoutes = ["/", "/login", "register"];

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
  }, [token, router]);

  if (token) {
    return null;
  }

  return <>{children}</>;
}
