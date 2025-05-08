import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";

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
        <button>Go to Login</button>
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
        <button>Go to Login</button>
      </div>
    </>
  );
};

export default registerSuccess;
