import Image from "next/image";
import styles from "./kyc.module.css";
import KYCVerification from "@/components/KYCVerification/kycverifications";

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
        <KYCVerification />
      </div>
    </div>
  );
}