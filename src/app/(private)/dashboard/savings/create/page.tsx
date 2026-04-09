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
import { getTotalBalance } from "@/libs/helpers";

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
          <h1 className={styles.firstNameText}>Savings Plans</h1>
          <p className={styles.subHeadingText}>
            Explore all of our savings plans here
          </p>
        </div>
        {/* <div className={styles.headingRight}>
          <Button className={styles.outlineButton}>Withdraw Funds</Button>
          <Button>Fund Account</Button>
        </div> */}
      </div>

      <div className={styles.midSection}>
        <div className={styles.savingsCard}>
          <SavingsWalletCard
            amount={getTotalBalance(accountDetails.data, "savings")}
          />
        </div>
        {/* <div className={styles.midSectionRight}>
          <Button className={styles.outlineButton}>Add Debit Card</Button>
          <Button className={styles.blockedButton}>Link Account</Button>
        </div> */}
      </div>

      <SavingsPlans showSoloSavers={showSoloSavers} />
    </div>
  );
};

export default Savings;
