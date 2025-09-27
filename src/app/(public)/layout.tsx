"use client";
import useToken from "@/store/tokenStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useToken();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  if (token) {
    return null;
  }

  return <>{children}</>;
}
