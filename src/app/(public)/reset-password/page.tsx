import styles from "./reset.module.css";
import LeftCaurosel from "@/components/onboarding/LeftCaurosel";
import ResetSuccess from "@/components/ResetSuccess";

import dynamic from "next/dynamic";

const ResetPasswordForm = dynamic(() => import("./ResetPasswordForm"));

const ForgotPassword = () => {
  return (
    <div className={styles.container}>
      {/* <ResetSuccess /> */}
      <div className={styles.leftContainer}>
        <LeftCaurosel />
      </div>
      <div className={styles.rightContainer}>
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
