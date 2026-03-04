import styles from "./kyc.module.css";
import KYCVerification from "@/components/KYCVerification/kycverifications";

import LeftCaurosel from "@/components/onboarding/LeftCaurosel";

export default function () {
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
