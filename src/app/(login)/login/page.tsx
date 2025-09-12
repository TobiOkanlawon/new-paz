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
<<<<<<< HEAD
          <h1>Welcome</h1>
=======
          <h2>Welcome</h2>
>>>>>>> chore/refactor
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
        <div className={styles.right}>
          <LoginForm />
        </div>
      </div>
      <div className={styles.mobile}>
        <Image
          src={"/PAZLogo.png"}
          alt="Logo"
          width={104}
          height={34.76}
          className={styles.logo}
        />
        <div className={styles.mobileContainer}>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
