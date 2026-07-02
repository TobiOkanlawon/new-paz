import React, { useState } from "react";
import Modal2 from "@/components/Modal2";
import styles from "./MakePaymentModal.module.css";
import Button from "@/components/Button";

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onPay?: (amount: string) => void;
  loading?: boolean;
};

const MakePaymentModal = ({ isOpen, onClose, onPay, loading }: Props) => {
  const [amount, setAmount] = useState("");

  return (
    <Modal2 isOpen={isOpen} onClose={onClose} width={645}>
      <div className={styles.container}>
        <h2 className={styles.title}>Make Payment</h2>

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

        <div className={styles.footer}>
          <Button variant="primary" loading={loading} onClick={() => onPay?.(amount)}>
            Make Payment
          </Button>
        </div>
      </div>
    </Modal2>
  );
};

export default MakePaymentModal;