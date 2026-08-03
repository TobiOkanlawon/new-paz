import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import DashboardGateShell from "./components/DashboardGateShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <DashboardGateShell
      initialIsBvnVerified={Boolean(session?.user?.isBvnVerified)}
      initialPrimaryAccountLinked={Boolean(session?.user?.primaryAccountLinked)}
    >
      {children}
    </DashboardGateShell>
  );
}
