import styles from "./page.module.css";
import React from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <Image
            src={"/PAZLogo.png"}
            alt="Logo"
            width={127}
            height={42.61}
            className={styles.logo}
          />
          <h1>Welcome</h1>
          <p>Powering Your Dreams!</p>
          <div className={styles.spacer}></div>
          <Image
            src={"/PazIlls2.png"}
            alt="PazIlls"
            width={736.59}
            height={488}
            className={styles.PazIlls}
          />
        </div>
        <div className={styles.right}>
          <h3>Login to your account</h3>
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
            <div className={styles.formBottom}>
              <div className={styles.rememberMe}>
                <input
                  type="checkbox"
                  className={styles.remember}
                  name="remember"
                  id="remember"
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <div>
                <a href="#">Forgot Password?</a>
              </div>
            </div>
            <button className={styles.login} type="submit">
              Login
            </button>
            <a href="#" className={styles.createNewAccount}>
              Create New Account <FaArrowRight />{" "}
            </a>
          </form>
        </div>
      </div>
    </>
  );
}
