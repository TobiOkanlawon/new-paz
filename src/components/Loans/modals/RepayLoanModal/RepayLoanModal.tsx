import React, { useState } from "react";
import Modal2 from "@/components/Modal2";
import styles from "./RepayLoanModal.module.css";
import Button from "@/components/Button";

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onRepay?: (amount: string) => void;
  loading?: boolean;
};

const RepayLoanModal = ({ isOpen, onClose, onRepay, loading }: Props) => {
  const [amount, setAmount] = useState("");

  return (
    <Modal2 isOpen={isOpen} onClose={onClose} width={440} title="Repay Loan">
      <div className={styles.container}>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Pay with</p>
          <label className={styles.radioOption}>
            <input type="radio" defaultChecked />
            <span>Use paystack</span>
          </label>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Input amount</p>
          <div className={styles.amountInput}>
            <span className={styles.flag}>🇳🇬</span>
            <span className={styles.currency}>N</span>
            <input
              className={styles.input}
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="primary"
          loading={loading}
          onClick={() => onRepay?.(amount)}
        >
          Repay Loan
        </Button>
      </div>
    </Modal2>
  );
};

export default RepayLoanModal;