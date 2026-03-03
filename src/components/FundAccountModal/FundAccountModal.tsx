import React, { useMemo, useState } from "react";
import ModalShell from "@/components/ModalShell/ModalShell";
import styles from "./fundAccountModal.module.css";
import Button from "../Button";
import Input from "../Input";

type PayMethod = "paystack";

type Props = {
  open: boolean;
  onClose: () => void;
  onFund?: (payload: { method: PayMethod; amount: number }) => void | Promise<void>;
  loading?: boolean;
  defaultMethod?: PayMethod;
};

const FundAccountModal = ({
  open,
  onClose,
  onFund,
  loading = false,
  defaultMethod = "paystack",
}: Props) => {
  const [method, setMethod] = useState<PayMethod>(defaultMethod);
  const [amount, setAmount] = useState<string>("");

  const numericAmount = useMemo(() => {
    const cleaned = amount.replace(/[^\d.]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const canSubmit = numericAmount > 0 && !loading;

  const handleFund = async () => {
    if (!canSubmit) return;
    await onFund?.({ method, amount: numericAmount });
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Fund Account" width={520}>
      <div className={styles.wrap}>
        <div className={styles.section}>
          <p className={styles.label}>Pay with</p>

          <label className={styles.radioRow}>
            <input
              type="radio"
              name="paymethod"
              checked={method === "paystack"}
              onChange={() => setMethod("paystack")}
            />
            <span>Use paystack</span>
          </label>
        </div>

        <div className={styles.section}>
          <Input
            label="Input amount"
            placeholder="₦ 0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
          />
        </div>

        <div className={styles.footer}>
          <div className={styles.buttonWrapper}>
            <Button
              variant="primary"
              loading={loading}
              disabled={!canSubmit}
              onClick={handleFund}
              className={styles.fullBtn}
            >
              Fund Account
            </Button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

export default FundAccountModal;