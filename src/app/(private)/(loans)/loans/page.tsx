"use client";
import styles from "./loans.module.css";
import LoanHeader from "@/components/LoanHeader";
import InstantLoanCard from "@/components/InstantLoanCard/index";
import { useState, useEffect } from "react";
import SavingsAlert from "@/components/SavingsAlert";
import FileUploader from "@/components/FIleInput";
import Notifications from "@/components/Notifications";
import LoanIsOwed from "@/components/Loans/LoanIsOwed";
import CanAccessLoan from "@/components/Loans/CanAccessLoan";
import { useGetLoanStatus } from "@/data/queries/useGetLoanStatus";
import { useGetWallet } from "@/data/queries/useGetWallet";
import { useWallet } from "@/store/walletStore";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
import useUser from "@/store/userStore";

interface Notification {
  id: string;
  message: string;
  time: string;
  amount?: string;
}

interface Notification {
  id: string;
  message: string;
  time: string;
  amount?: string;
}

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
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);
  const { walletInformation } = useWallet();
  type LoanStatus = "non" | "pending" | "approved" | "withdrawn" | "repaid";

  const loanStatusFromAPI = useGetLoanStatus(
    walletInformation?.walletId as string,
  );

  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [loanStatus, setLoanStatus] = useState<LoanStatus>("non");

  const [loanPurpose, setLoanPurpose] = useState<string>("");
  const [loanDuration, setLoanDuration] = useState<string>("");

  const [isVisible, setIsVisible] = useState(false);
  const [isWithdrawalVisible, setIsWithdrawalVisible] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isFirstLoan, setIsFirstLoan] = useState(true);
  const [eligibleAmount, setEligibleAmount] = useState<number>(0);
  const [modalSummary, setModalSummary] = useState<boolean>(false);

  const handleButtonVisibility = () => setIsVisible(true);
  const handleWithdrawalButtonVisibility = () => setIsWithdrawalVisible(true);
  const handlePending = () => setIsPending(true);
  const handleIsFirstLoan = () => setIsFirstLoan(false);

  const notifications: Notification[] = [
    // { id: "1", message: "PAZ saver account created", time: "2 hours ago" },
    // { id: "2", message: "PAZ saver account created", time: "2 hours ago" },
    // { id: "3", message: "PAZ saver account created", time: "2 hours ago" },
  ];

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  // pre-application
  // if ()

  // if (!loanStatusFromAPI?.data?.Approved && )

  // covers the cose where the user has applied for a loan but it hasn't been approved
  if (loanStatusFromAPI.data?.Consent && loanStatusFromAPI.data?.Consent) {
  }

  if (loanStatusFromAPI.data?.Approved && loanStatusFromAPI.data?.Consent) {
    // covers the case where the user has gotten a loan and consented to it.
    return <LoanIsOwed />;
  }

  // covers the case where the user has not applied for a loan, or they don't have any outstanding
  if (loanStatusFromAPI?.data?.Approved) return <CanAccessLoan />;

  // return (
  //   <div className={styles.container}>
  //     <div className={styles.header}>
  //       <div>
  //         <h1>Loans</h1>
  //         <p>Explore all our loan options here.</p>
  //       </div>
  //       {isFirstLoan ? undefined : (
  //         <button onClick={handleModalOpen}>Get a Loan</button>
  //       )}
  //     </div>
  //     <div className={styles.totalAmountCardContainer}>
  //       <LoanBalanceCard
  //         loanAmount={accountDetails.accountDetails?.loanAmount}
  //         loanStatus={loanStatus}
  //         onUpdateStatus={setLoanStatus}
  //       />
  //     </div>
  //     {isFirstLoan ? (
  //       <InstantLoanCard
  //         handleModalOpen={handleModalOpen}
  //         handleIsFirstLoan={handleIsFirstLoan}
  //       />
  //     ) : (
  //       <>
  //         <Notifications header="Recent activity" />
  //       </>
  //     )}
  //     {isModalOpen && (
  //       <Modal onClose={handleModalClose} isOpen={isModalOpen}>
  //         <h1 className={styles.modalTitle}>Instant Loan Application Form</h1>
  //         <p className={styles.modalDescription}>
  //           Get instant loan quick and easy
  //         </p>
  //         <form onSubmit={formik.handleSubmit} className={styles.modalForm}>
  //           <SelectGroup
  //             id="purpose"
  //             label="Purpose of loan"
  //             options={[
  //               { label: "Personal", value: "personal" },
  //               { label: "Business", value: "business" },
  //             ]}
  //             placeholder="Select loan purpose"
  //             {...formik.getFieldProps("purpose")}
  //           />
  //           <Input
  //             id="amount"
  //             label="Amount"
  //             placeholder="Enter how much you need"
  //             {...formik.getFieldProps("amount")}
  //           />
  //           <SelectGroup
  //             id="duration"
  //             label="Loan duration"
  //             options={[
  //               { label: "1 month", value: "1month" },
  //               { label: "3 months", value: "3months" },
  //               { label: "6 months", value: "6months" },
  //             ]}
  //             placeholder="Select loan duration"
  //             {...formik.getFieldProps("duration")}
  //           />

  //           <div className={styles.modalButton}>
  //             <button type="submit">Check Eligibility</button>
  //           </div>
  //         </form>
  //       </Modal>
  //     )}
  //     {eligibilityModalOpen && (
  //       <Modal
  //         onClose={() => setEligibilityModalOpen(false)}
  //         isOpen={eligibilityModalOpen}
  //       >
  //         {isAboveThreshold ? (
  //           <div className={`${styles.eligibilityDetails} ${styles.modal2}`}>
  //             <h3>Instant Loan Application Form</h3>
  //             <p>Get instant loan quick and easy</p>
  //             <div className={`${styles.modalForm2}`}>
  //               <FileUploader />
  //             </div>
  //             <button
  //               className={styles.button2}
  //               onClick={() => {
  //                 setEligibilityModalOpen(false);
  //                 setModalSummary(true);
  //               }}
  //             >
  //               Continue
  //             </button>
  //           </div>
  //         ) : (
  //           <div className={styles.eligibilityDetails}>
  //             <h3>Loan Eligibility</h3>
  //             <p>You are only eligible to</p>
  //             <h1>{`₦${eligibleAmount}`}</h1>
  //             <h6>
  //               For a period of <span>1 MONTH</span>
  //             </h6>
  //             <button
  //               onClick={() => {
  //                 setEligibilityModalOpen(false);
  //                 setIsAlertVisible(true);
  //               }}
  //             >
  //               Take Loan
  //             </button>
  //           </div>
  //         )}
  //       </Modal>
  //     )}
  //     {/* MODAL LOAN SUMMARY */}
  //     {modalSummary && (
  //       <Modal onClose={() => setModalSummary(false)} isOpen={modalSummary}>
  //         {
  //           <div className={`${styles.loanSummary} ${styles.modal2}`}>
  //             <h2>Loan application summary</h2>
  //             <p>Please look through and verify the form</p>
  //             <div className={styles.formDetails}>
  //               <div>
  //                 <p>Loan amount</p>
  //                 <h3>{`₦${loanAmount.toLocaleString()}`}</h3>
  //               </div>
  //               <div>
  //                 <p>Loans application</p>
  //                 <h3>{loanPurpose}</h3>
  //               </div>
  //               <div>
  //                 <p>Loan duration</p>
  //                 <h3>{loanDuration}</h3>
  //               </div>
  //               <div>
  //                 <p>Monthly repayment</p>
  //                 <h3>N770,000</h3>
  //               </div>
  //             </div>
  //             <p>
  //               By continuing with this request you consent to us charging your
  //               acccounts in the event that your default with your loan refund.
  //             </p>
  //             <button
  //               className={styles.button2}
  //               onClick={() => {
  //                 setModalSummary(false);
  //                 formik.handleSubmit();
  //                 setAlertMessage("Loan has been submitted for approval");
  //                 // handlePending();
  //                 setIsAlertVisible(true);
  //               }}
  //             >
  //               Get Loan
  //             </button>
  //           </div>
  //         }
  //       </Modal>
  //     )}
  //   </div>
  // );
};
export default Loans;
