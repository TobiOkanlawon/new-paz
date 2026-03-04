import Image from "next/image";
import styles from "./addAccount.module.css";
import KYCVerification from "@/components/KYCVerification/kycverifications";
import AddAccountVerification from "@/components/AddAccountVerification/AddAccountVerification";

import LeftCaurosel from "@/components/onboarding/LeftCaurosel";

export default function OnboardingLayout({
  children,
}: {
    children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <LeftCaurosel />
      </div>
      <div className={styles.rightContainer}>
        <AddAccountVerification />
      </div>
    </div>
  );
}