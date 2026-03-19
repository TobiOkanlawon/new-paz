"use server";
import { getServerSession } from "next-auth";
import TargetSaver from "./TargetSaver";
import { getAccountSummary } from "@/actions/dashboard";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(authOptions);

  const result = await getAccountSummary(session?.user?.email || "");

  if (!result.success) {
    return <div>Failed to load account</div>;
  }

  return <TargetSaver accountDetails={result.data} />;
}
