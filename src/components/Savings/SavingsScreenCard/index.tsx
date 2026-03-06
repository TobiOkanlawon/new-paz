import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

const SavingsWalletCard = ({ amount }) => {
  return (
    <div>
      <div className={styles.walletCard}>
        <div className={styles.walletTop}>
          <div className={styles.walletTitle}>
            <span className={styles.flag}>🇳🇬</span>
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
          <div className={styles.walletBottom}>
            <button className={styles.viewBtn}>View all savings</button>
          </div>
        </div>

        <div className={clsx(styles.circle, styles.circleLeft)}></div>
        <div className={clsx(styles.circle, styles.circleRight)}></div>
      </div>
    </div>
  );
};

export default SavingsWalletCard;
