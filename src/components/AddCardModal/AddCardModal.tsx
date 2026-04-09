import React, { useMemo, useState } from "react";
import ModalShell from "../ModalShell/ModalShell";
import styles from "./addCartModal.module.css";
import Button from "../Button";
import Input from "../Input";

type Props = {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  onAddCard?: (payload: {
    cardType: string;
    holderName: string;
    cardNumber: string;
    cvv: string;
    expiry: string;
  }) => void | Promise<void>;
};

const AddCardModal = ({ open, onClose, loading = false, onAddCard }: Props) => {
  const [cardType, setCardType] = useState("");
  const [holderName, setHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

  const canSubmit = useMemo(() => {
    return (
      cardType.trim() &&
      holderName.trim() &&
      cardNumber.replace(/\s/g, "").length >= 12 &&
      cvv.trim().length >= 3 &&
      expiry.trim().length >= 4 &&
      !loading
    );
  }, [cardType, holderName, cardNumber, cvv, expiry, loading]);

  const handleAdd = async () => {
    if (!canSubmit) return;
    await onAddCard?.({ cardType, holderName, cardNumber, cvv, expiry });
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Add Card" width={560}>
      <div className={styles.wrap}>
        <p className={styles.subtitle}>
          Enter your details to add your debit card
        </p>

        <div className={styles.field}>
          <label className={styles.selectLabel}>Card Type</label>
          <select
            className={styles.select}
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            <option value="" disabled>
              Select card
            </option>
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
            <option value="Verve">Verve</option>
          </select>
        </div>

        <Input
          name="cardHolder"
          label="Card Holder Name"
          placeholder="Enter full name"
          value={holderName}
          onChange={(e) => setHolderName(e.target.value)}
        />

        <Input
          name="cardNumber"
          label="Card Number"
          placeholder="Enter card number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          inputMode="numeric"
        />

        <Input
          name="cvv"
          label="Cvv"
          placeholder="Enter cvv number"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          inputMode="numeric"
          maxLength={4}
        />

        <Input
          name="expiryDate"
          label="Expiry Date"
          placeholder="Enter expiry date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          inputMode="numeric"
          maxLength={5}
        />

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
            onClick={handleAdd}
            className={styles.actionBtn}
          >
            Add Card
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default AddCardModal;
