"use client";
import React, { useState } from "react";
import DashboardShell from "./DashboardShell";
import AccountGate from "./AccountGate/AccountGate";

type Props = {
  initialIsBvnVerified: boolean;
  initialPrimaryAccountLinked: boolean;
  children: React.ReactNode;
};

export default function DashboardGateShell({
  initialIsBvnVerified,
  initialPrimaryAccountLinked,
  children,
}: Props) {
  const [isBvnVerified, setIsBvnVerified] = useState(initialIsBvnVerified);
  const [primaryAccountLinked, setPrimaryAccountLinked] = useState(
    initialPrimaryAccountLinked,
  );

  if (!isBvnVerified || !primaryAccountLinked) {
    return (
      <AccountGate
        isBvnVerified={isBvnVerified}
        primaryAccountLinked={primaryAccountLinked}
        onBvnVerified={() => setIsBvnVerified(true)}
        onAccountLinked={() => setPrimaryAccountLinked(true)}
      />
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}
