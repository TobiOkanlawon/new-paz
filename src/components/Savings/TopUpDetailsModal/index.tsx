"use client";

import ModalShell from "@/components/ModalShell/ModalShell";
import Button from "@/components/Button";
import styles from "./styles.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  data: {
    accountName: string;
    accountNumber: string;
    bank: { name: string };
    amount: number;
    displayText: string;
  } | null;
};

const formatMoney = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

const TopUpTransferDetailsModal = ({ open, onClose, data }: Props) => {
  if (!data) return null;

  return (
    <ModalShell open={open} onClose={onClose} title="Complete Your Payment">
      <div className={styles.container}>
        <p className={styles.info}>{data.displayText}</p>

        <div className={styles.card}>
          <div>
            <p className={styles.label}>Bank</p>
            <p className={styles.value}>{data.bank.name}</p>
          </div>

          <div>
            <p className={styles.label}>Account Number</p>
            <p className={styles.value}>{data.accountNumber}</p>
          </div>

          <div>
            <p className={styles.label}>Account Name</p>
            <p className={styles.value}>{data.accountName}</p>
          </div>

          <div>
            <p className={styles.label}>Amount</p>
            <p className={styles.value}>{formatMoney(data.amount)}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={onClose}>I have paid</Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default TopUpTransferDetailsModal;
