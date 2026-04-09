import styles from "./forgot.module.css";
import dynamic from "next/dynamic";
import LeftCaurosel from "@/components/onboarding/LeftCaurosel";

const ForgotPasswordForm = dynamic(() => import("./ForgotPasswordForm"));

const ForgotPassword = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <LeftCaurosel />
      </div>
      <div className={styles.rightContainer}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
