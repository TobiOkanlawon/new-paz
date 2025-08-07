"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./loanBalanceCard.module.css";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import Modal from "../Modal/index";
import InputGroup from "../InputGroup";
import Link from "next/link";

type LoanStatus = "pending" | "approved" | "withdrawn" | "repaid" | "non";

interface TotalBalanceCardProps {
  loanAmount: number;
  loanStatus: LoanStatus;
  onUpdateStatus: (status: LoanStatus) => void;
}

const LoanBalanceCard: React.FC<TotalBalanceCardProps> = ({
  loanAmount,
  loanStatus,
  onUpdateStatus,
}) => {
  const [showMoney, setShowMoney] = useState(true);

  const displayAmount =
    loanStatus === "withdrawn" && loanAmount
      ? (-loanAmount).toLocaleString()
      : loanAmount.toLocaleString();
  // const [loanStatus, setLoanStatus] = useState<LoanStatus>("non");

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);

  const h3Ref = useRef<HTMLHeadingElement>(null);
  const [isStacked, setIsStacked] = useState(false);

  const handleToggle = () => setShowMoney((prev) => !prev);

  // Optional: Simulate backend approval after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loanStatus === "pending") {
        onUpdateStatus("approved");
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [loanStatus, onUpdateStatus]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setIsStacked(width > 180); // Adjust threshold as needed
    });
    if (h3Ref.current) observer.observe(h3Ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={
        isStacked && loanStatus !== "non" && loanStatus !== "repaid"
          ? `${styles.totalBalanceCard} ${styles.totalBalanceCardStacked}`
          : styles.totalBalanceCard
      }
    >
      <p>Loan balance</p>
      <div
        className={
          isStacked
            ? `${styles.contentContainer} ${styles.stack}`
            : styles.contentContainer
        }
      >
        <h3 ref={h3Ref} className={styles.amountHeader}>
          ₦ {showMoney ? displayAmount : "****"}{" "}
          <span>
            <Image
              src={showMoney ? "/eyeOff.png" : "/eyeOff.png"}
              alt="Money Toggle"
              width={12}
              height={12}
              style={{ cursor: "pointer" }}
              onClick={handleToggle}
            />
          </span>
        </h3>

        {/* Pending status */}
        {loanStatus === "pending" && (
          <div className={styles.pendingContainer}>
            <p style={{ background: "#E3B44F" }}>Pending approval</p>
          </div>
        )}

        {/* Withdraw Loan */}
        {loanStatus === "approved" && (
          <button
            className={styles.cardButton}
            style={{ backgroundColor: "#4F85E3", width: "50%" }}
            onClick={() => setShowWithdrawModal(true)}
          >
            Withdraw Loan <FaPlus />
          </button>
        )}

        {/* Repay Loan */}
        {loanStatus === "withdrawn" && (
          <button
            className={styles.cardButton}
            style={{ backgroundColor: "#4F85E3", width: "60%" }}
            onClick={() => setShowRepayModal(true)}
          >
            Repay Loan <FaPlus />
          </button>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <Modal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
        >
          <div className={styles.WithdrawalModalContainer}>
            <h2>Withdraw Your Loan</h2>
            <p>Select your withdrawal method</p>
            <div className={styles.withdrawalmodalFormContainer}>
              <div>
                <p>Amount due for withdrawal</p>
                <h4>₦ {loanAmount.toLocaleString()}</h4>
              </div>
              <InputGroup
                label="Select account to credit*"
                placeholder="Select bank to withdraw into"
              />
              <Link href={"#"}>+ Add account to PAZ here</Link>
            </div>
            <button
              onClick={() => {
                setShowWithdrawModal(false);
                onUpdateStatus("withdrawn");
              }}
            >
              Withdraw
            </button>
          </div>
        </Modal>
      )}

      {/* Repay Modal */}
      {showRepayModal && (
        <Modal isOpen={showRepayModal} onClose={() => setShowRepayModal(false)}>
          <div className={styles.modalContainer}>
            <h2>Repay Loan</h2>
            <p>Payback your loan to increase your chance of another one</p>
            <div className={styles.withdrawalmodalFormContainer}>
              <InputGroup
                label="Amount to refund*"
                placeholder="Enter how much you want to pay back "
              />
              <InputGroup
                label="Select account to charge*"
                placeholder="Select bank to withdraw from"
              />
            </div>
            <button
              onClick={() => {
                setShowRepayModal(false);
                onUpdateStatus("repaid");
              }}
            >
              Repay Loan
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LoanBalanceCard;
