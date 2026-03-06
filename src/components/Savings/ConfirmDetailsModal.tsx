"use client";
import React from "react";
import ModalShell from "@/components/ModalShell/ModalShell";
import Button from "@/components/Button";
import styles from "./confirmationDetailsModal.module.css";

interface ConfirmationValues {
  accountName: string;
  initialDeposit: number;
  contributionFrequency: string;
  contributionAmount: number;
}

interface Props {
  isOpen: boolean;
  accountType: string;
  values: ConfirmationValues;
  isSubmitting: boolean;
  serverError?: string | null;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const formatCurrency = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

const ConfirmationDetailsModal: React.FC<Props> = ({
  isOpen,
  accountType,
  values,
  isSubmitting,
  serverError,
  onBack,
  onClose,
  onConfirm,
}) => {
  return (
    <ModalShell title="Confirmation Details" open={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <p className={styles.subtitle}>
          Confirm your {values.accountName.toLowerCase()} account details
        </p>

        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>Account Summary</h3>

          <div className={styles.row}>
            <span className={styles.label}>Account Type:</span>
            <span className={styles.value}>{accountType}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Account Name:</span>
            <span className={styles.value}>{values.accountName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Initial Deposit:</span>
            <span className={styles.value}>
              {formatCurrency(values.initialDeposit)}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Contribution:</span>
            <span className={styles.value}>
              {formatCurrency(values.contributionAmount)}{" "}
              {values.contributionFrequency.toLowerCase()}
            </span>
          </div>
        </div>

        {serverError && <p className={styles.errorText}>{serverError}</p>}
        <div className={styles.buttons}>
          <Button
            type="button"
            variant="outlined"
            onClick={onBack}
            disabled={isSubmitting}
            className={styles.backButton}
          >
            Back to Edit
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={styles.confirmButton}
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default ConfirmationDetailsModal;
