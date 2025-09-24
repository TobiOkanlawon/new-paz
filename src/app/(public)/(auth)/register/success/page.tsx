import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";

const registerSuccess = () => {
  return (
    <>
      <div className={styles.right}>
        <h3>Create Account Succesfully</h3>
        <Image
          src={"/authenticate.png"}
          alt="Authenticate"
          width={225}
          height={212}
          className={styles.authenticate}
        />
        <p>Please check your email to verify your account and login</p>
        <Link href={"/login"} className={styles.link}>
          <Button>Go to Login</Button>
        </Link>
      </div>
      <div className={styles.mobile}>
        <Image
          src={"/PAZLogo2.png"}
          alt="Logo"
          width={127}
          height={42.61}
          className={styles.logo}
        />
        <h3>Create Account Succesfully</h3>
        <Image
          src={"/authenticate.png"}
          alt="Authenticate"
          width={225}
          height={212}
          className={styles.authenticate}
        />
        <p>Please check your email to verify your account and login</p>
        <Link href={"/login"} className={styles.link}>
          <Button>Go to Login</Button>
        </Link>
      </div>
    </>
  );
};

export default registerSuccess;
