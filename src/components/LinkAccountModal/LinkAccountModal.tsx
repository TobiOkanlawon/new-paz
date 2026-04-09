import React, { useMemo, useState } from "react";
import ModalShell from "../ModalShell/ModalShell";
import styles from "./linkAccountModal.module.css";
import Button from "../Button";
import Input from "../Input";

type Props = {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  onLink?: (payload: {
    holderName: string;
    bankName: string;
    accountNumber: string;
    accountType: string;
  }) => void | Promise<void>;
};

const LinkAccountModal = ({
  open,
  onClose,
  loading = false,
  onLink,
}: Props) => {
  const [holderName, setHolderName] = useState("");
  const [bankName, setBankName] = useState("United Bank of Africa");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");

  const canSubmit = useMemo(() => {
    return (
      holderName.trim() &&
      bankName.trim() &&
      accountNumber.trim().length >= 10 &&
      accountType.trim() &&
      !loading
    );
  }, [holderName, bankName, accountNumber, accountType, loading]);

  const handleLink = async () => {
    if (!canSubmit) return;
    await onLink?.({ holderName, bankName, accountNumber, accountType });
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Link Account" width={560}>
      <div className={styles.wrap}>
        <p className={styles.subtitle}>
          Enter your details to link your account to Paz
        </p>

        <Input
          name="accountHolderName"
          label="Account Holder Name"
          placeholder="Enter full name"
          value={holderName}
          onChange={(e) => setHolderName(e.target.value)}
        />

        <div className={styles.field}>
          <label className={styles.selectLabel}>Bank Name</label>
          <select
            className={styles.select}
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          >
            <option>United Bank of Africa</option>
            <option>GTBank</option>
            <option>Access Bank</option>
            <option>Zenith Bank</option>
            <option>First Bank</option>
            <option>Stanbic IBTC</option>
          </select>
        </div>

        <Input
          name="accountNumber"
          label="Account Number"
          placeholder="2006427004"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          inputMode="numeric"
          maxLength={10}
        />

        <div className={styles.field}>
          <label className={styles.selectLabel}>Account Type</label>
          <select
            className={styles.select}
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="MasterCard" disabled>
              Master Card
            </option>
            <option value="Visa">Visa</option>
            <option value="Current">Current</option>
            <option value="Domiciliary">Domiciliary</option>
          </select>
        </div>

        <div className={styles.actions}>
          <Button
            variant="outlined"
            onClick={onClose}
            className={styles.actionBtn}
          >
            Back
          </Button>

          <Button
            variant="primary"
            loading={loading}
            disabled={!canSubmit}
            onClick={handleLink}
            className={styles.actionBtn}
          >
            Link Account
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default LinkAccountModal;
