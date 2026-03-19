import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
// import Link from "next/link";
import Ngn from "@/assets/Ngn.png";
import Image from "next/image";
type Props = {
  amount: number;
};

const SavingsWalletCard = ({ amount }: Props) => {
  return (
    <div>
      <div className={styles.walletCard}>
        <div className={styles.walletTop}>
          <div className={styles.walletTitle}>
            <Image
              className={styles.flag}
              src={Ngn}
              alt="Naira"
              width={18}
              height={18}
            />
            <span>Savings wallet</span>
          </div>

          <div className={styles.returns}>Get up to 40% returns</div>
        </div>

        <div className={styles.walletMiddle}>
          <div>
            <p className={styles.balanceLabel}>Available Balance</p>

            <div className={styles.balanceRow}>
              <h1 className={styles.balance}>N {amount}</h1>
              <span className={styles.eye}>👁</span>
            </div>
          </div>
          {/*<div className={styles.walletBottom}>
            <Link href="/dashboard/savings/create">
              <button className={styles.viewBtn}>View all savings</button>
            </Link>
            </div>*/}
        </div>

        <div className={clsx(styles.circle, styles.circleLeft)}></div>
        <div className={clsx(styles.circle, styles.circleRight)}></div>
      </div>
    </div>
  );
};

export default SavingsWalletCard;
