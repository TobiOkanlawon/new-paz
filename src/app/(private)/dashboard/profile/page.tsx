"use server";
import { getServerSession } from "next-auth";
import Profile from "./Profile";
import { getProfile } from "@/actions/profile";

export default async function Page() {
  const session = await getServerSession();

  const result = await getProfile();

  if (!result.success) {
    return <div>Failed to load account</div>;
  }

  console.log(result.data);

  return <Profile />;
}
