import styles from "./register.module.css";
import Image from "next/image";
import LeftSide from "@/components/onboarding/LeftCaurosel";
import Input from "@/components/Input";

import dynamic from "next/dynamic";

const RegisterForm = dynamic(() => import("./RegisterForm"));

const register = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <LeftSide />
      </div>
      <div className={styles.rightContainer}>
      <RegisterForm />
      </div>
    </div>

  );
};

export default register;
