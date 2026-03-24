"use server";

import SoloSaver from "./SoloSaver";
import { getAccountSummary } from "@/actions/dashboard";

export default async function Page() {
  const result = await getAccountSummary();

  if (!result.success) {
    return <div>Failed to load account</div>;
  }

  return <SoloSaver accountDetails={result.data} />;
}
