"use server";
import styles from "./savings.module.css";
import Image, { StaticImageData } from "next/image";
import Button from "@/components/Button";
import SavingsPlanMiniCard from "@/components/Savings/SavingsCard";

import Rose from "@/assets/noto_rose.svg";
import Piggy from "@/assets/piggy-bank.svg";
import SavingsWalletCard from "@/components/Savings/SavingsScreenCard";
import TransactionsTable, {
  TransactionRow,
} from "@/components/TransactionTable/TransactionTable";
import SavingsPlans from "./component";
import { getAccountSummary } from "@/actions/dashboard";

const Savings = async () => {
  const accountDetails = await getAccountSummary();

  if (!accountDetails.success) {
    return;
  }
  const showSoloSavers = !accountDetails.data.hasSoloAccount;

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div className={styles.headingLeft}>
          <h1 className={styles.firstNameText}>Savings</h1>
          <p className={styles.subHeadingText}>
            Explore all of our savings plans here
          </p>
        </div>
        <div className={styles.headingRight}>
          <Button className={styles.outlineButton}>Withdraw Funds</Button>
          <Button>Fund Account</Button>
        </div>
      </div>

      <div className={styles.midSection}>
        <div className={styles.savingsCard}>
          <SavingsWalletCard amount="0.00" />
        </div>
        <div className={styles.midSectionRight}>
          <Button className={styles.outlineButton}>Add Debit Card</Button>
          <Button>Link Account</Button>
        </div>
      </div>

      <SavingsPlans showSoloSavers={showSoloSavers} />
    </div>
  );
};

export default Savings;
