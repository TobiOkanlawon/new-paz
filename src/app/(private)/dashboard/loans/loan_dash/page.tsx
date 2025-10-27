"use client";
import styles from "./loans.module.css";
import LoanHeader from "@/components/LoanHeader";
import { useState, useEffect } from "react";
import SavingsAlert from "@/components/SavingsAlert";
import Notifications from "@/components/Notifications";
import LoanApplicationModal from "@/components/LoanApplicationModal";
import EligibilityModal from "@/components/EligibilityModal";
import ModalSummary from "@/components/ModalSummary";

const Loans = () => {
  interface Notification {
    id: string;
    message: string;
    time: string;
    amount?: string;
  }

  const [isAboveThreshold, setIsAboveThreshold] = useState(false);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const handleLoanEligibility = (amount: number) => {
    if (amount > 250_000) {
      setIsAboveThreshold(true);
    } else {
      setIsAboveThreshold(false);
    }
  };


  type LoanStatus = "non" | "pending" | "approved" | "withdrawn" | "repaid";

  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [loanStatus, setLoanStatus] = useState<LoanStatus>("non");

  useEffect(() => {
    if (loanStatus === "repaid") {
      setLoanAmount(0);
    }
  }, [loanStatus]);

  const [loanPurpose, setLoanPurpose] = useState<string>("");
  const [loanDuration, setLoanDuration] = useState<string>("");

  const [isVisible, setIsVisible] = useState(false);
  const [isWithdrawalVisible, setIsWithdrawalVisible] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isFirstLoan, setIsFirstLoan] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eligibleAmount, setEligibleAmount] = useState<number>(0);
  const [modalSummary, setModalSummary] = useState<boolean>(false);

  const handleButtonVisibility = () => setIsVisible(true);
  const handleWithdrawalButtonVisibility = () => setIsWithdrawalVisible(true);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handlePending = () => setIsPending(true);
  const handleIsFirstLoan = () => setIsFirstLoan(false);

  const notifications: Notification[] = [
    // { id: "1", message: "PAZ saver account created", time: "2 hours ago" },
    // { id: "2", message: "PAZ saver account created", time: "2 hours ago" },
    // { id: "3", message: "PAZ saver account created", time: "2 hours ago" },
  ];

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Loan disbursed successful");

  return (
    <div className={styles.container}>
      {/* CHANGE TOAST AND USE THE ONE THAT WAS USED IN THE AUTH SECTION */}
      <SavingsAlert
        isActive={isAlertVisible}
        isSuccessful={true}
        onClose={() => setIsAlertVisible(false)}
        message={alertMessage}
      />
      <LoanHeader
        isFirstLoan={isFirstLoan}
        handleModalOpen={handleModalOpen}
        loanAmount={loanAmount}
        loanStatus={loanStatus}
        setLoanStatus={setLoanStatus}
      />
      
      <Notifications header="Recent activity" />

      {/* LOAN APPLICATION MODAL */}
      <LoanApplicationModal 
        isModalOpen={isModalOpen}
        handleModalClose={handleModalClose}
        onSubmit={(values) => {
          setLoanAmount(values.amount);
          setLoanPurpose(values.purpose);
          setLoanDuration(values.duration);
          setEligibleAmount(values.amount);

          if (values.amount >= 250000) {
            setLoanStatus("pending");
          } else {
            setLoanStatus("approved");
          }

          setIsModalOpen(false);
          setEligibilityModalOpen(true);
          handleLoanEligibility(values.amount);
        }}
      />
      {/* ELIGIBILITY MODAL */}
      <EligibilityModal
        isOpen={eligibilityModalOpen}
        onClose={() => setEligibilityModalOpen(false)}
        isAboveThreshold={isAboveThreshold}
        eligibleAmount={eligibleAmount}
        onContinue={() => {
          setEligibilityModalOpen(false);
          setModalSummary(true);
        }}
        onTakeLoan={() => {
          setEligibilityModalOpen(false);
          setIsAlertVisible(true);
        }}
      />
      {/* MODAL LOAN SUMMARY */}
      <ModalSummary 
        isOpen={modalSummary}
        onClose={() => setModalSummary(false)}
        loanAmount={loanAmount}
        loanPurpose={loanPurpose}
        loanDuration={loanDuration}
        onSubmit={() => {
          setModalSummary(false);
          setAlertMessage("Loan has been submitted for approval");
          // handlePending();
          setIsAlertVisible(true);
        }}
      />
    </div>
  );
};
export default Loans;
