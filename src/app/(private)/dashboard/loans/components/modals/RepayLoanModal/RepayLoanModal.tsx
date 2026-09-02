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
  `₦${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Adds thousands separators to a raw "1234.5" style string while typing,
// without disturbing a trailing decimal point/digit still being entered.
const formatAmountDisplay = (raw: string): string => {
  if (!raw) return "";
  const [intPart, decPart] = raw.split(".");
  const formattedInt = intPart
    ? Number(intPart).toLocaleString("en-US")
    : "";
  return decPart !== undefined
    ? `${formattedInt}.${decPart}`
    : formattedInt;
};

const RepayLoanModal = ({
  isOpen,
  onClose,
  outstandingBalance,
}: Props) => {
  const router = useRouter();

  const [amount, setAmount] = useState(
    Number(outstandingBalance).toFixed(2)
  );

  const [error, setError] = useState("");

  const liquidateMutation = useLiquidateLoan();

  useEffect(() => {
    if (isOpen) {
      setAmount(Number(outstandingBalance).toFixed(2));
      setError("");
    }
  }, [isOpen, outstandingBalance]);

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Strip the thousands separators back out before validating/storing
    const value = e.target.value.replace(/,/g, "");

    // Allow empty input
    if (value === "") {
      setAmount("");
      setError("");
      return;
    }

    // Only allow numbers with a maximum of 2 decimal places
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    setAmount(value);
    setError("");
  };

  const handleRepay = () => {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    // Convert Naira → Kobo
    const amountInKobo = Math.round(numericAmount * 100);

    // Outstanding balance is assumed to be in Naira
    const outstandingBalanceInKobo = Math.round(
      outstandingBalance * 100
    );

    if (amountInKobo > outstandingBalanceInKobo) {
      setError("Amount can't be more than the outstanding balance");
      return;
    }

    setError("");

    // Send KOBO to the API
    liquidateMutation.mutate(amountInKobo, {
      onSuccess: () => {
        toast("Loan repayment successful");
        router.refresh();
        onClose();
      },
      onError: (mutationError) => {
        toast(
          mutationError.message ||
            "Could not repay loan, please try again"
        );
      },
    });
  };

  return (
    <Modal2
      isOpen={isOpen}
      onClose={onClose}
      width={440}
      title="Repay Loan"
    >
      <div className={styles.container}>
        <div className={styles.summary}>
          <div className={styles.row}>
            <span className={styles.label}>
              Outstanding Balance
            </span>

            <span className={styles.value}>
              {formatNgn(outstandingBalance)}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Deduct from</p>
          <div className={styles.walletSource}>
            PAZ Wallet
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>
            Amount to repay
          </p>

          <div className={styles.amountInput}>
            <span className={styles.currency}>₦</span>

            <input
              className={styles.input}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={formatAmountDisplay(amount)}
              onChange={handleAmountChange}
            />
          </div>

          {error && (
            <p className={styles.error}>{error}</p>
          )}
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