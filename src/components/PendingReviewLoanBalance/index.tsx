import Image from "next/image";
import { useState } from "react";
import styles from "./styles.module.css";

type BalanceProps = {
  amount: number;
};

const LoanBalanceCard: React.FC<BalanceProps> = ({ amount }) => {
  const displayAmount = Intl.NumberFormat("en-US").format(amount);

  const [showMoney, setShowMoney] = useState(true);

  const handleToggle = () => setShowMoney((prev) => !prev);

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <p>Loan balance</p>
        <div className={styles.moneyStyles}>
          <h3 className={styles.amountHeader}>
            ₦ {showMoney ? displayAmount : "****"}{" "}
            <span>
              <Image
                src={"/eyeOff.png"}
                alt="Money Toggle"
                width={12}
                height={12}
                style={{ cursor: "pointer" }}
                onClick={handleToggle}
              />
            </span>
          </h3>
        </div>
      </div>

      <div className={styles.pendingContainer}>
        <p>Pending Approval</p>
      </div>
    </div>
  );
};

export default LoanBalanceCard;
