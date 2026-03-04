"use client";

import styles from "./mobileActions.module.css";
import Image from "next/image";

interface Props {
  setOpenWithdraw: (value: boolean) => void;
  setShowTopUpModal: (value: boolean) => void;
}

export default function MobileActions({
  setOpenWithdraw,
  setShowTopUpModal,
}: Props) {
  return (
    <div className={styles.container}>
      <button
        onClick={() => setShowTopUpModal(true)}
        className={styles.button}
      >
        <Image 
            src={'/images/moneyPlus.png'}
            alt="Top Up Account"
            width={24}
            height={24}
        />
        Top Up Account
      </button>

      <button
        onClick={() => setOpenWithdraw(true)}
        className={styles.button}
      >
        <Image 
            src={'/images/fx.png'}
            alt="Withdraw Funds"
            width={24}
            height={24}
        />
        Withdraw Funds
      </button>
    </div>
  );
}