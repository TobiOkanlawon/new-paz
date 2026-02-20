import Image from "next/image";
import styles from "./page.module.css";
import LoginForm from "./LoginForm";
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
        <LoginForm />
      </div>
    </div>
  );
}