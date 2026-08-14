"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Modal2 from "@/components/Modal2";
import Button from "@/components/Button";
import useLiquidateLoan from "@/data/mutations/useLiquidateLoan";
import styles from "./RepayLoanModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  outstandingBalance: number;
};

const formatNgn = (amount: number) =>
  `₦${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const RepayLoanModal = ({ isOpen, onClose, outstandingBalance }: Props) => {
  const router = useRouter();
  const [amount, setAmount] = useState(String(outstandingBalance));
  const [error, setError] = useState("");
  const liquidateMutation = useLiquidateLoan();

  // Re-seed the input with the latest outstanding balance each time the
  // modal opens, rather than carrying over a stale value from last time.
  useEffect(() => {
    if (isOpen) {
      setAmount(String(outstandingBalance));
      setError("");
    }
  }, [isOpen, outstandingBalance]);

  const handleRepay = () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (numericAmount > outstandingBalance) {
      setError("Amount can't be more than the outstanding balance");
      return;
    }

    setError("");

    liquidateMutation.mutate(numericAmount, {
      onSuccess: () => {
        toast("Loan repayment successful");
        router.refresh();
        onClose();
      },
      onError: (mutationError) => {
        toast(mutationError.message || "Could not repay loan, please try again");
      },
    });
  };

  return (
    <Modal2 isOpen={isOpen} onClose={onClose} width={440} title="Repay Loan">
      <div className={styles.container}>
        <div className={styles.summary}>
          <div className={styles.row}>
            <span className={styles.label}>Outstanding Balance</span>
            <span className={styles.value}>{formatNgn(outstandingBalance)}</span>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Deduct from</p>
          <div className={styles.walletSource}>PAZ Wallet</div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Amount to repay</p>
          <div className={styles.amountInput}>
            <span className={styles.currency}>₦</span>
            <input
              className={styles.input}
              type="number"
              min={0}
              max={outstandingBalance}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <Button
          variant="primary"
          loading={liquidateMutation.isPending}
          onClick={handleRepay}
        >
          Repay Loan
        </Button>
      </div>
    </Modal2>
  );
};

export default RepayLoanModal;
