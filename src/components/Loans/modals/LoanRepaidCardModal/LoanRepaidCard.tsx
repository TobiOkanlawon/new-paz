import React from "react";
import styles from "./LoanRepaidCard.module.css";
import Button from "@/components/Button";
import { BsCheckLg } from "react-icons/bs";
import Modal2 from "@/components/Modal2";

type SummaryDetail = {
  label: string;
  value: string;
};

type BenefitRow = {
  label: string;
  oldValue: string;
  newValue: string;
};

type Props = {
  userName: string;
  summaryDetails: SummaryDetail[];
  benefits?: BenefitRow[];
  onBack?: VoidFunction;
  onApply?: VoidFunction;
  isOpen: boolean;
  onClose: VoidFunction;
};

const LoanRepaidCard = ({
  isOpen,
  onClose,
  userName,
  summaryDetails,
  benefits = [],
  onBack,
  onApply,
}: Props) => {
  return (
    <Modal2 isOpen={isOpen} onClose={onClose}>
        <div className={styles.container}>
        {/* Check Icon */}
        <div className={styles.iconWrapper}>
            <BsCheckLg size={28} color="#17A842" />
        </div>

        {/* Header */}
        <div className={styles.header}>
            <h2 className={styles.title}>Loan Repaid!</h2>
            <p className={styles.subtitle}>
            Well done {userName}! your loan has been fully repaid. Your financial
            record looks great.
            </p>
        </div>

        {/* Repayment Summary */}
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Repayment Summary</h3>
            <div className={styles.rows}>
            {summaryDetails.map((d) => (
                <div key={d.label} className={styles.row}>
                <span className={styles.rowLabel}>{d.label}</span>
                <span className={styles.rowValue}>{d.value}</span>
                </div>
            ))}
            </div>
        </div>

        {/* Benefits */}
        {benefits.length > 0 && (
            <div className={styles.section}>
            <h3 className={styles.benefitsTitle}>
                ⭐ You've unlocked new benefits
            </h3>
            <div className={styles.rows}>
                {benefits.map((b) => (
                <div key={b.label} className={styles.row}>
                    <span className={styles.rowLabel}>{b.label}</span>
                    <div className={styles.upgradeRow}>
                    <span className={styles.oldValue}>{b.oldValue}</span>
                    <span className={styles.arrow}>→</span>
                    <span className={styles.newValue}>{b.newValue}</span>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
            <Button variant="outlined" onClick={onBack}>Back</Button>
            <Button variant="primary" onClick={onApply}>Apply for a Loan</Button>
        </div>
        </div>
    </Modal2>
  );
};

export default LoanRepaidCard;