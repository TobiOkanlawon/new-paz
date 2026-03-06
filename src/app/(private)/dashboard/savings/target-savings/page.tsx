"use server";
import { getServerSession } from "next-auth";
import TargetSaver from "./TargetSaver";
import { getAccountSummary } from "@/actions/dashboard";

export default async function Page() {
  const session = await getServerSession();

  const result = await getAccountSummary(session?.user?.email || "");

  if (!result.success) {
    return <div>Failed to load account</div>;
  }

  console.log(result.data);

  return <TargetSaver accountDetails={result.data} />;
}
