import styles from "./forgot.module.css";
import Image from "next/image";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Link from "next/link";

import dynamic from "next/dynamic";

const ForgotPasswordForm = dynamic(() => import("./ForgotPasswordForm"));

// const ForgotPassword = () => {
//   return (
//     <>
//       <div className={styles.right}>
//         <ForgotPasswordForm />
//       </div>
//       <div className={styles.mobile}>
//         <Image
//           src={"/PAZLogo2.png"}
//           alt="Logo"
//           width={104}
//           height={34.76}
//           className={styles.logo}
//         />
//         <div className={styles.mobileContainer}>
//           <ForgotPasswordForm />
//         </div>
//       </div>
//     </>
//   );
// };

const ForgotPassword = () => {
  return (
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
      <div className={styles.right}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
