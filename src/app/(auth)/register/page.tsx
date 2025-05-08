import React from "react";
import styles from "./register.module.css";
import Image from "next/image";
import { FaArrowLeft, FaEyeSlash } from "react-icons/fa";

const register = () => {
  return (
    <>
      <div className={styles.right}>
        <h3>Create a secure account</h3>
        <form action="GET" className={styles.form}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email address"
            name="email"
            id="email"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            id="password"
          />
          <label htmlFor="confirmPassword">Re - Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Enter the password you entered in the box above"
            id="confirmPassword"
          />
          <p>
            By clicking “Sign up”, I agree to PAZ’s{" "}
            <a href="#">privacy policy</a> and <a href="#">terms of service</a>.
          </p>
          <button className={styles.register} type="submit">
            Create account
          </button>
        </form>
        <a href="#">
          <FaArrowLeft className={styles.arrowLeft} /> Return to Log in{" "}
        </a>
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
          <h3>Create a secure account</h3>
          <form action="GET" className={styles.form}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              name="email"
              id="email"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              id="password"
            />
            <label htmlFor="confirmPassword">Re - Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter the password you entered in the box above"
              id="confirmPassword"
            />
            <p>
              By clicking “Sign up”, I agree to PAZ’s{" "}
              <a href="#">privacy policy</a> and{" "}
              <a href="#">terms of service</a>.
            </p>
            <button className={styles.register} type="submit">
              Create account
            </button>
          </form>
          <a href="#">
            <FaArrowLeft className={styles.arrowLeft} /> Return to Log in{" "}
          </a>
        </div>
      </div>
    </>
  );
};

export default register;
