"use client";
import useToken from "@/store/tokenStore";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useToken();
  const router = useRouter();

  if (token) {
    router.replace("/dashboard");
    return null;
  }

  return <>{children}</>;
}
