"use client";
import styles from "./loans.module.css";
import LoanBalanceCard from "@/components/LoanBalance/index";
import InstantLoanCard from "@/components/InstantLoanCard/index";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import SelectGroup from "@/components/InputGroup/SelectGroup";
import Input from "@/components/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import SavingsAlert from "@/components/SavingsAlert";
import FileUploader from "@/components/FIleInput";
import Notifications from "@/components/Notifications";

const schema = yup.object({
  purpose: yup.string().required("Please select a purpose for the loan"),
  amount: yup
    .number()
    .required("Please enter the amount you need")
    .positive("Amount must be positive")
    .integer("Amount must be an integer"),
  duration: yup.string().required("Please select a loan duration"),
});

type LoanSchema = yup.InferType<typeof schema>;

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

  const formik = useFormik<LoanSchema>({
    initialValues: {
      purpose: "",
      amount: 1000,
      duration: "",
    },
    validationSchema: schema,
    onSubmit: (values, formikHelpers) => {
      setLoanAmount(values.amount);
      setLoanPurpose(values.purpose);
      setLoanDuration(values.duration);
      setEligibleAmount(values.amount);

      if (values.amount >= 250000) {
        setLoanStatus("pending");
      } else {
        setLoanStatus("approved");
      }

      formikHelpers.resetForm();
      setIsModalOpen(false);
      setEligibilityModalOpen(true);
      handleLoanEligibility(values.amount);
    },
  });
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
      <SavingsAlert
        isActive={isAlertVisible}
        isSuccessful={true}
        onClose={() => setIsAlertVisible(false)}
        message={alertMessage}
      />
      <div className={styles.header}>
        <div>
          <h1>Loans</h1>
          <p>Explore all our loan options here.</p>
        </div>
        {isFirstLoan ? undefined : (
          <button onClick={handleModalOpen}>Get a Loan</button>
        )}
      </div>
      <div className={styles.totalAmountCardContainer}>
        <LoanBalanceCard
          loanAmount={loanAmount}
          loanStatus={loanStatus}
          onUpdateStatus={setLoanStatus}
        />
      </div>
      {isFirstLoan ? (
        <InstantLoanCard
          handleModalOpen={handleModalOpen}
          handleIsFirstLoan={handleIsFirstLoan}
        />
      ) : (
        <>
          <Notifications header="Recent activity" />
        </>
      )}
      {isModalOpen && (
        <Modal onClose={handleModalClose} isOpen={isModalOpen}>
          <h1 className={styles.modalTitle}>Instant Loan Application Form</h1>
          <p className={styles.modalDescription}>
            Get instant loan quick and easy
          </p>
          <form onSubmit={formik.handleSubmit} className={styles.modalForm}>
            <SelectGroup
              id="purpose"
              label="Purpose of loan"
              options={[
                { label: "Personal", value: "personal" },
                { label: "Business", value: "business" },
              ]}
              placeholder="Select loan purpose"
              {...formik.getFieldProps("purpose")}
            />
            <Input
              id="amount"
              label="Amount"
              placeholder="Enter how much you need"
              {...formik.getFieldProps("amount")}
            />
            <SelectGroup
              id="duration"
              label="Loan duration"
              options={[
                { label: "1 month", value: "1month" },
                { label: "3 months", value: "3months" },
                { label: "6 months", value: "6months" },
              ]}
              placeholder="Select loan duration"
              {...formik.getFieldProps("duration")}
            />

            <div className={styles.modalButton}>
              <button type="submit">Check Eligibility</button>
            </div>
          </form>
        </Modal>
      )}
      {eligibilityModalOpen && (
        <Modal
          onClose={() => setEligibilityModalOpen(false)}
          isOpen={eligibilityModalOpen}
        >
          {isAboveThreshold ? (
            <div className={`${styles.eligibilityDetails} ${styles.modal2}`}>
              <h3>Instant Loan Application Form</h3>
              <p>Get instant loan quick and easy</p>
              <div className={`${styles.modalForm2}`}>
                <FileUploader />
              </div>
              <button
                className={styles.button2}
                onClick={() => {
                  setEligibilityModalOpen(false);
                  setModalSummary(true);
                }}
              >
                Continue
              </button>
            </div>
          ) : (
            <div className={styles.eligibilityDetails}>
              <h3>Loan Eligibility</h3>
              <p>You are only eligible to</p>
              <h1>{`₦${eligibleAmount}`}</h1>
              <h6>
                For a period of <span>1 MONTH</span>
              </h6>
              <button
                onClick={() => {
                  setEligibilityModalOpen(false);
                  setIsAlertVisible(true);
                }}
              >
                Take Loan
              </button>
            </div>
          )}
        </Modal>
      )}
      {/* MODAL LOAN SUMMARY */}
      {modalSummary && (
        <Modal onClose={() => setModalSummary(false)} isOpen={modalSummary}>
          {
            <div className={`${styles.loanSummary} ${styles.modal2}`}>
              <h2>Loan application summary</h2>
              <p>Please look through and verify the form</p>
              <div className={styles.formDetails}>
                <div>
                  <p>Loan amount</p>
                  <h3>{`₦${loanAmount.toLocaleString()}`}</h3>
                </div>
                <div>
                  <p>Loans application</p>
                  <h3>{loanPurpose}</h3>
                </div>
                <div>
                  <p>Loan duration</p>
                  <h3>{loanDuration}</h3>
                </div>
                <div>
                  <p>Monthly repayment</p>
                  <h3>N770,000</h3>
                </div>
              </div>
              <p>
                By continuing with this request you consent to us charging your
                acccounts in the event that your default with your loan refund.
              </p>
              <button
                className={styles.button2}
                onClick={() => {
                  setModalSummary(false);
                  formik.handleSubmit();
                  setAlertMessage("Loan has been submitted for approval");
                  // handlePending();
                  setIsAlertVisible(true);
                }}
              >
                Get Loan
              </button>
            </div>
          }
        </Modal>
      )}
    </div>
  );
};
export default Loans;
