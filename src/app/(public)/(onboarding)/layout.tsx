import Image from "next/image";
import styles from "./layout.module.css";

import LeftCaurosel from "@/components/onboarding/LeftCaurosel";

export default function OnboardingLayout({
  children,
}: {
    children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <LeftCaurosel />
      <div className={styles.rightContainer}>
        {children}
      </div>
    </div>
  );
}