import React, { useMemo, useState } from "react";
import styles from "./withdrawSoloSavingsModal.module.css";
import ModalShell from "@/components/ModalShell/ModalShell";
import Input from "@/components/Input";
import Button from "@/components/Button";
import FundingSourceCard from "@/components/FundingSourceCard/FundingSourceCard";
import Image from "next/image";


type Props = {
  open: boolean;
  onClose: () => void;

  accountName: string;
  currentSavings: number;

  fundingSourceTitle: string;
  fundingSourceBalance: number;

  currency?: string;
  quickAmounts?: number[];

  loading?: boolean;
  onConfirm?: (payload: { amount: number }) => void | Promise<void>;
};

const formatMoney = (n: number, currency: string) =>
  `${currency}${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

const parseAmount = (val: string) => {
  const cleaned = val.replace(/[^\d.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const WithdrawSoloSavingsModal = ({
  open,
  onClose,
  accountName,
  currentSavings,
  fundingSourceTitle,
  fundingSourceBalance,
  currency = "₦",
  quickAmounts = [5000, 10000, 15000, 20000],
  loading = false,
  onConfirm,
}: Props) => {
  const [amount, setAmount] = useState("");
  const amountNumber = useMemo(() => parseAmount(amount), [amount]);

  const canSubmit = amountNumber > 0 && amountNumber <= currentSavings && !loading;

  const handleQuick = (n: number) => setAmount(String(n));

  const handleConfirm = async () => {
    if (!canSubmit) return;
    await onConfirm?.({ amount: amountNumber });
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Withdraw from Solo savers" width={700}>
      <div className={styles.wrap}>
        {/* Account summary row */}
        <div className={styles.summaryRow}>
          <div>
            <p className={styles.label}>Account Name</p>
            <p className={styles.value}>{accountName}</p>
          </div>

          <div className={styles.rightAlign}>
            <p className={styles.label}>Current Savings</p>
            <p className={styles.value}>{formatMoney(currentSavings, currency)}</p>
          </div>
        </div>

        <div className={styles.hr} />

        {/* Amount */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Withdrawal Amount</p>
          <Input
            label=""
            placeholder={`${currency}0.00`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
          />
          {amountNumber > currentSavings && (
            <p className={styles.errorText}>Amount exceeds current savings.</p>
          )}
        </div>

        {/* Quick amounts */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Quick Amount</p>
          <div className={styles.quickGrid}>
            {quickAmounts.map((n) => (
              <button
                key={n}
                type="button"
                className={styles.quickBtn}
                onClick={() => handleQuick(n)}
              >
                {formatMoney(n, currency).replace(".00", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Funding source (selected style like screenshot) */}
        <div className={styles.section}>
          <FundingSourceCard
            title={fundingSourceTitle}
            subtitle={`Balance: ${formatMoney(fundingSourceBalance, currency)}`}
            selected
            icon={<Image src={'/images/wallet.png'} width={24} height={24} alt="Wallet Icon"/>}
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button variant="outlined" onClick={onClose} className={styles.actionBtn}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={loading}
            disabled={!canSubmit}
            onClick={handleConfirm}
            className={styles.actionBtn}
          >
            Withdraw Funds
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default WithdrawSoloSavingsModal;