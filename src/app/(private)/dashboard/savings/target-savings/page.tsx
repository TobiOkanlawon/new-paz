"use server";

import TargetSaver from "./TargetSaver";
import { getAccountSummary } from "@/actions/dashboard";

export default async function Page() {
  const result = await getAccountSummary();

  if (!result.success) {
    return <div>Failed to load account</div>;
  }

  return <TargetSaver accountDetails={result.data} />;
}
