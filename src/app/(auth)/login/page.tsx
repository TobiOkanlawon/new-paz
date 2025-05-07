import styles from "./page.module.css";
import Image from "next/image";

import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("./LoginForm"));

export default function Login() {
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
            alt="Paz background"
            width={736.59}
            height={488}
            className={styles.PazIlls}
          />
        </div>
        <LoginForm />
      </div>
    </>
  );
}
