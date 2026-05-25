import React from "react";
import Modal2 from "@/components/Modal2";
import styles from "./ProjectFinanceLoanDetailsModal.module.css";
import Button from "@/components/Button";

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  details: {
    projectName: string;
    loanAmount: string;
    dateSubmitted: string;
    dateApproved: string;
    status: "Success" | "Pending" | "Failed";
  };
};

const statusColors: Record<string, string> = {
  Success: "#17A842",
  Pending: "#E09A1A",
  Failed: "#E05C5C",
};

const ProjectFinanceLoanDetailsModal = ({ isOpen, onClose, details }: Props) => (
  <Modal2 isOpen={isOpen} onClose={onClose} width={647}>
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Loan Details</h2>
        <p className={styles.subtitle}>View more details about your loan</p>
      </div>

      <div className={styles.summary}>
        <p className={styles.summaryTitle}>Loan Summary</p>

        <div className={styles.row}>
          <span className={styles.label}>Project Name:</span>
          <span className={styles.value}>{details.projectName}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Loan Amount:</span>
          <span className={styles.value}>{details.loanAmount}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Date Submitted:</span>
          <span className={styles.value}>{details.dateSubmitted}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Date Approved:</span>
          <span className={styles.value}>{details.dateApproved}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Status:</span>
          <span
            className={styles.status}
            style={{
              color: statusColors[details.status],
              backgroundColor: `${statusColors[details.status]}20`,
            }}
          >
            {details.status}
          </span>
        </div>
      </div>

      <Button variant="outlined2" onClick={onClose}>Cancel</Button>
    </div>
  </Modal2>
);

export default ProjectFinanceLoanDetailsModal;