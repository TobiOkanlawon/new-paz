"use client";
import React, { useState } from "react";
import { BsExclamationCircleFill } from "react-icons/bs";
import Modal2 from "@/components/Modal2";
import Button from "@/components/Button";
import { useGetPendingLoan } from "@/data/queries/useGetPendingLoan";
import RepayLoanModal from "../RepayLoanModal/RepayLoanModal";
import styles from "./OverdueLoanModal.module.css";

const formatNgn = (amount: number) =>
  `₦${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const OverdueLoanModal = () => {
  const { data: loan } = useGetPendingLoan();
  const [dismissed, setDismissed] = useState(false);
  const [repayOpen, setRepayOpen] = useState(false);

  const outstandingBalance = loan
    ? loan.TotalPayable - loan.AmountLiquidated
    : 0;

  const isOverdue =
    !!loan &&
    outstandingBalance > 0 &&
    new Date(loan.MaturityDate).getTime() < Date.now();

  const isOpen = isOverdue && !dismissed && !repayOpen;

  const handleRemindLater = () => setDismissed(true);

  const handlePayNow = () => setRepayOpen(true);

  return (
    <>
      <Modal2 isOpen={isOpen} onClose={handleRemindLater} width={420}>
        <div className={styles.container}>
          <div className={styles.iconWrap}>
            <BsExclamationCircleFill size={28} color="#E02424" />
          </div>
          <h2 className={styles.title}>Your loan is overdue</h2>
          <p className={styles.subtitle}>
            Your {loan?.ProductName?.replace(/_/g, " ").toLowerCase()} was due
            on {loan ? formatDate(loan.MaturityDate) : "—"}. Please repay it
            to avoid penalties.
          </p>

          <div className={styles.summary}>
            <div className={styles.row}>
              <span className={styles.label}>Outstanding Balance :</span>
              <span className={styles.value}>
                {formatNgn(outstandingBalance)}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Due Date :</span>
              <span className={styles.value}>
                {loan ? formatDate(loan.MaturityDate) : "—"}
              </span>
            </div>
          </div>

          <div className={styles.footer}>
            <Button
              variant="outlined"
              className={styles.remindButton}
              onClick={handleRemindLater}
              style={{fontSize: "14px"}}
            >
              Remind Me Later
            </Button>
            <Button variant="primary" onClick={handlePayNow}>
              Pay Now
            </Button>
          </div>
        </div>
      </Modal2>

      <RepayLoanModal
        isOpen={repayOpen}
        onClose={() => setRepayOpen(false)}
        outstandingBalance={outstandingBalance}
      />
    </>
  );
};

export default OverdueLoanModal;
