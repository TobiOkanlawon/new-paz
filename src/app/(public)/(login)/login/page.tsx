import styles from "./page.module.css";
import LoginForm from "./LoginForm";
import LeftCaurosel from "@/components/onboarding/LeftCaurosel";

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <LeftCaurosel />
      </div>
      <div className={styles.rightContainer}>
        <LoginForm />
      </div>
    </div>
  );
}
