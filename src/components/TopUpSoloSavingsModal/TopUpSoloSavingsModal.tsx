"use client";

import React from "react";
import styles from "./topUpSoloSavingsModal.module.css";
import ModalShell from "@/components/ModalShell/ModalShell";
import Input from "@/components/Input";
import Button from "@/components/Button";
import FundingSourceCard from "@/components/FundingSourceCard/FundingSourceCard";
import { handleErrorDisplay } from "@/libs/helpers";

import { useFormik } from "formik";
import * as yup from "yup";

type Props = {
  open: boolean;
  onClose: () => void;

  accountName: string;
  currentBalance: number;

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

const validationSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .min(1000, "You can only top up a minimum of 1000"),
});

const TopUpSoloSavingsModal = ({
  open,
  onClose,
  accountName,
  currentBalance,
  currency = "₦",
  quickAmounts = [5000, 10000, 15000, 20000],
  loading = false,
  onConfirm,
}: Props) => {
  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const amountNumber = parseAmount(values.amount);

      await onConfirm?.({ amount: amountNumber });

      resetForm();
      onClose();
    },
  });

  const handleQuick = (n: number) => {
    formik.setFieldValue("amount", String(n));
  };

  const amountNumber = parseAmount(formik.values.amount);
  const canSubmit = amountNumber > 0 && !loading;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Top up Solo Savings"
      width={980}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.wrap}>
          {/* Account summary */}
          <div className={styles.summaryRow}>
            <div>
              <p className={styles.label}>Account Name</p>
              <p className={styles.value}>{accountName}</p>
            </div>

            <div className={styles.rightAlign}>
              <p className={styles.label}>Current Balance</p>
              <p className={styles.value}>
                {formatMoney(currentBalance, currency)}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Top up Amount</p>
            <Input
              label=""
              placeholder="Enter Amount"
              {...formik.getFieldProps("amount")}
              errors={handleErrorDisplay(formik, "amount")}
            />
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

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              className={styles.actionBtn}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!canSubmit}
              className={styles.actionBtn}
            >
              Confirm Top up
            </Button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
};

export default TopUpSoloSavingsModal;
