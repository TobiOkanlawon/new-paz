"use client";

import useToken from "@/store/tokenStore";
import { useRouter } from "next/navigation";

export default function PrivateGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useToken();
  const router = useRouter();

  if (!token) {
    router.replace("/login");
    return null;
  }

  return <>{children}</>;
}
