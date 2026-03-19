"use server";

import Profile from "./Profile";
import { getProfile } from "@/actions/profile";

export default async function Page() {
  const result = await getProfile();

  if (!result.success) {
    return <div>Failed to load account</div>;
  }

  return <Profile data={result.data} />;
}
