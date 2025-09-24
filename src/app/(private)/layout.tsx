"use client";
import { redirect } from "next/navigation";
import { useRecoilValue } from "recoil";
import { authTokenState } from "@/data/atoms";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useRecoilValue(authTokenState);

  if (!token) {
    redirect("/login");
  }

  return { children };
}
