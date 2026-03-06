"use server";
import { getServerSession } from "next-auth";
import SoloSaver from "./SoloSaver";
import { getAccountSummary } from "@/actions/dashboard";

export default async function Page() {
  const session = await getServerSession();

  const result = await getAccountSummary(session?.user?.email || "");

  if (!result.success) {
    return <div>Failed to load account</div>;
  }

  console.log(result.data);

  return <SoloSaver accountDetails={result.data} />;
}
