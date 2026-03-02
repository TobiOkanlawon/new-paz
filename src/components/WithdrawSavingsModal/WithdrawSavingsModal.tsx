import React, { useMemo, useState } from "react";
import ModalShell from "../ModalShell/ModalShell";
import styles from "./withdrawSavingsModal.module.css";
import Button from "../Button";
import Input from "../Input";
import Image from "next/image";

type Source = "paz_savings" | "bank_account";

type Props = {
  open: boolean;
  onClose: () => void;
  loading?: boolean;

  currentSavingsLabel?: string;
  currentSavingsAmount?: number; // e.g. 600000

  onWithdraw?: (payload: { amount: number; source: Source }) => void | Promise<void>;
};

const formatNaira = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

const WithdrawSavingsModal = ({
  open,
  onClose,
  loading = false,
  currentSavingsLabel = "Current Savings",
  currentSavingsAmount = 600000,
  onWithdraw,
}: Props) => {
  const [amount, setAmount] = useState<string>("");
  const [source, setSource] = useState<Source>("paz_savings");

  const numericAmount = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const canSubmit = numericAmount > 0 && numericAmount <= currentSavingsAmount && !loading;

  const setQuick = (n: number) => setAmount(String(n));

  const handleWithdraw = async () => {
    if (!canSubmit) return;
    await onWithdraw?.({ amount: numericAmount, source });
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Withdraw from Savings Account" width={620}>
      <div className={styles.wrap}>
        <div className={styles.topCard}>
          <div className={styles.topLeft}>
            <Image src="/images/piggy.png" width={64} height={55} alt="Savings Icon" className={styles.icon} />
            <div>
              <p className={styles.topTitle}>{currentSavingsLabel}</p>
              <p className={styles.topAmount}>{formatNaira(currentSavingsAmount)}</p>
            </div>
          </div>
        </div>

        <Input
          label="Withdrawal Amount"
          placeholder="₦ 0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
        />

        <div className={styles.quickWrap}>
          <p className={styles.sectionTitle}>Quick Amount</p>
          <div className={styles.quickGrid}>
            <button className={styles.quickBtn} onClick={() => setQuick(20000)} type="button">
              ₦20,000
            </button>
            <button className={styles.quickBtn} onClick={() => setQuick(50000)} type="button">
              ₦50,000
            </button>
            <button className={styles.quickBtn} onClick={() => setQuick(100000)} type="button">
              ₦100,000
            </button>
            <button className={styles.quickBtn} onClick={() => setQuick(200000)} type="button">
              ₦200,000
            </button>
          </div>
        </div>

        <div className={styles.sourceWrap}>
          <div
            className={`${styles.sourceCard} ${source === "paz_savings" ? styles.sourceCardActive : ""}`}
            onClick={() => setSource("paz_savings")}
          >
            <div className={styles.sourceIconWrap}>
             <Image src="/images/wallet.png" width={24} height={24} alt="PAZ Savings Icon" className={styles.sourceIcon} />
            </div>
            <div className={styles.sourceBody}>
              <p className={styles.sourceTitle}>PAZ Savings</p>
              <p className={styles.sourceSub}>Balance: {formatNaira(currentSavingsAmount)}</p>
            </div>
            {source === "paz_savings" && (
                <Image src="/images/check.png" width={15} height={15} alt="Selected" className={styles.checkIcon} />
            )}
          </div>

          <div
            className={`${styles.sourceCard} ${source === "bank_account" ? styles.sourceCardActive : ""}`}
            onClick={() => setSource("bank_account")}
          >
            <div className={styles.sourceIconWrap}>
              <Image src="/images/bank.png" width={24} height={24} alt="PAZ Savings Icon" className={styles.sourceIcon} />
            </div>
            <div className={styles.sourceBody}>
              <p className={styles.sourceTitle}>United Bank of Africa</p>
              <p className={styles.sourceSub}>2006427004</p>
            </div>
            {source === "bank_account" && (
                <Image src="/images/check.png" width={15} height={15} alt="Selected" className={styles.checkIcon} />
            )}
          </div>
        </div>

        {numericAmount > currentSavingsAmount && (
          <p className={styles.errorText}>
            Amount exceeds your available savings balance.
          </p>
        )}

        <div className={styles.actions}>
          <Button variant="outlined" onClick={onClose} className={styles.actionBtn}>
            Cancel
          </Button>

          <Button
            variant="primary"
            loading={loading}
            disabled={!canSubmit}
            onClick={handleWithdraw}
            className={styles.actionBtn}
          >
            Withdraw Funds
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default WithdrawSavingsModal;