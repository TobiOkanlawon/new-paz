import React from "react";
import styles from "./register.module.css";
import Image from "next/image";

import dynamic from "next/dynamic";

const RegisterForm = dynamic(() => import("./RegisterForm"));

const register = () => {
  return (
    <>
      <div className={styles.right}>
        <Image
          src={"/PAZLogo2.png"}
          alt="Logo"
          width={104}
          height={34.76}
          className={styles.logoMain}
        />
        <RegisterForm />
      </div>
      <div className={styles.mobile}>
        <Image
          src={"/PAZLogo2.png"}
          alt="Logo"
          width={104}
          height={34.76}
          className={styles.logo}
        />
        <div className={styles.mobileContainer}>
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

export default register;
