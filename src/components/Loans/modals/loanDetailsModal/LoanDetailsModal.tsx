import React from "react";
import Modal2 from "@/components/Modal2";
import styles from "./LoanDetailsModal.module.css";
import Button from "@/components/Button";

type LoanDetail = {
  label: string;
  value: string;
};

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  details: LoanDetail[];
};

const LoanDetailsModal = ({ isOpen, onClose, details }: Props) => (
  <Modal2 isOpen={isOpen} onClose={onClose} width={400} title="Loan Details">
    <div className={styles.container}>
      <div>
        <p className={styles.subtitle}>View more details about your loan</p>
      </div>
      <div className={styles.summary}>
        <p className={styles.summaryTitle}>Loan Summary</p>
        {details.map((d) => (
          <div key={d.label} className={styles.row}>
            <span className={styles.label}>{d.label}</span>
            <span className={styles.value}>{d.value}</span>
          </div>
        ))}
      </div>
      <Button variant="outlined2" onClick={onClose}>Cancel</Button>
    </div>
  </Modal2>
);

export default LoanDetailsModal;