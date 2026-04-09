import styles from "./addAccount.module.css";

import AddAccountVerification from "@/components/AddAccountVerification/AddAccountVerification";

import LeftCaurosel from "@/components/onboarding/LeftCaurosel";

export default function Page() {
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
