import React from "react";
import styles from "./forgot.module.css";
import Image from "next/image";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Link from "next/link";

import dynamic from "next/dynamic";

const ForgotPasswordForm = dynamic(() => import("./ForgotPasswordForm"));

const ForgotPassword = () => {
  return (
    <>
      <div className={styles.right}>
        <ForgotPasswordForm />
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
          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
