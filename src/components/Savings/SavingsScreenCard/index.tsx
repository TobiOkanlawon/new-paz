"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import { LuEye, LuEyeOff } from "react-icons/lu";
// import Link from "next/link";
import Ngn from "@/assets/Ngn.png";
import Image from "next/image";
type Props = {
  amount: number;
};

const SavingsWalletCard = ({ amount }: Props) => {
  const [showAmount, setShowAmount] = useState(true);
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
              <h1 className={styles.balance}>
                N {showAmount ? amount : "••••••"}
              </h1>
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowAmount((prev) => !prev)}
                aria-label={showAmount ? "Hide balance" : "Show balance"}
              >
                {showAmount ? <LuEye size={24} /> : <LuEyeOff size={24} />}
              </button>
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
