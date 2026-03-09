"use server";
import Image from "next/image";
import styles from "./layout.module.css";

import LeftCarousel from "@/components/onboarding/LeftCaurosel";
import { getServerSession } from "next-auth";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // if the user is logged in then show the logged in view
  // if the user is logged out but they are on the log in screen then show the

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        {session?.accessToken ? (
          <LeftCarousel view="logged in" />
        ) : (
          <LeftCarousel view="logged out" />
        )}
      </div>
      <div className={styles.rightContainer}>{children}</div>
    </div>
  );
}
