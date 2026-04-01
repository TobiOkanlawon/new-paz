"use server";

import SoloSaver from "./SoloSaver";
import { getAccountSummary } from "@/actions/dashboard";

export default async function Page() {
  const result = await getAccountSummary();

  if (!result.success) {
    throw new Error("failed to load account");
  }

  return <SoloSaver accountDetails={result.data} />;
}
