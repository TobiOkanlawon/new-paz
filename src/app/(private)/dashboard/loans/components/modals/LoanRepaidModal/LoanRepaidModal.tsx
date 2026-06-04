import React from "react";
import Modal2 from "@/components/Modal2";
import styles from "./LoanRepaidModal.module.css";
import { BsCheckCircleFill } from "react-icons/bs";
import LoanFormFooter from "../../shared/LoanFormFooter";

type RepaymentDetail = { label: string; value: string };

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  userName: string;
  details: RepaymentDetail[];
  newLoanLimit?: string;
  newRepaymentPeriod?: string;
  onApplyForLoan?: VoidFunction;
};

const LoanRepaidModal = ({
  isOpen, onClose, userName, details,
  newLoanLimit, newRepaymentPeriod, onApplyForLoan,
}: Props) => (
  <Modal2 isOpen={isOpen} onClose={onClose} width={380}>
    <div className={styles.container}>
      <BsCheckCircleFill size={48} color="#17A842" />
      <h2 className={styles.title}>Loan Repaid!</h2>
      <p className={styles.subtitle}>
        Well done {userName}! your loan has been fully repaid.
        Your financial record looks great.
      </p>

      <div className={styles.summary}>
        <p className={styles.summaryTitle}>Repayment Summary</p>
        {details.map((d) => (
          <div key={d.label} className={styles.row}>
            <span className={styles.label}>{d.label}</span>
            <span className={styles.value}>{d.value}</span>
          </div>
        ))}
      </div>

      {(newLoanLimit || newRepaymentPeriod) && (
        <div className={styles.benefits}>
          <p className={styles.benefitsTitle}>🏆 You've unlocked new benefits</p>
          {newLoanLimit && (
            <div className={styles.row}>
              <span className={styles.label}>Loan Limit:</span>
              <span className={styles.upgrade}>
                N50,000 → <span className={styles.highlight}>{newLoanLimit}</span>
              </span>
            </div>
          )}
          {newRepaymentPeriod && (
            <div className={styles.row}>
              <span className={styles.label}>Repayment Period:</span>
              <span className={styles.upgrade}>
                30 days → <span className={styles.highlight}>{newRepaymentPeriod}</span>
              </span>
            </div>
          )}
        </div>
      )}

      <LoanFormFooter onBack={onClose} onContinue={onApplyForLoan} continueLabel="Apply for a Loan" />
    </div>
  </Modal2>
);

export default LoanRepaidModal;