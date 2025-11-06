"use client";
import { ErrorComponent } from "@/components/Error";
import { Loading } from "@/components/Loading";
import AwaitingConsent from "@/components/Loans/AwaitingConsent";
import CanAccessLoan from "@/components/Loans/CanAccessLoan";
import LoanIsOwed from "@/components/Loans/LoanIsOwed";
import PendingReview from "@/components/Loans/PendingReview";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
import { useGetLoanStatus } from "@/data/queries/useGetLoanStatus";
import { useGetWallet } from "@/data/queries/useGetWallet";
import useUser from "@/store/userStore";
import * as Yup from "yup";

const schema = Yup.object({
  purpose: Yup.string().required("Please select a purpose for the loan"),
  amount: Yup.number()
    .required("Please enter the amount you need")
    .positive("Amount must be positive")
    .integer("Amount must be an integer"),
  duration: Yup.string().required("Please select a loan duration"),
});

const Loans = () => {
  const { user } = useUser();

  const {
    data: accountDetails,
    isLoading: accountDetailsIsLoading,
    error: accDetailsError,
  } = useGetAccountDetails(user?.email as string);

  const {
    data: walletData,
    isLoading,
    error,
  } = useGetWallet(user?.email as string);

  const {
    data: loanData,
    isLoading: loanRequestIsLoading,
    error: loanRequestError,
  } = useGetLoanStatus(walletData?.walletId as string);

  if (isLoading || loanRequestIsLoading || accountDetailsIsLoading)
    return <Loading />;

  if (error || accDetailsError) return <ErrorComponent />;

  if (accountDetails!.totalLoan == 0) {
    if (!loanData) return <CanAccessLoan />;
  }

  /*
  amount in this case refers to the loan amount requested for, after the amount has been approved and disbursed, it's tracked by the totalLoan flag in accountDetails
   */

  /* basically, if the amount is greater than 0, and approved is false and consent is false, then that means that the user has asked for a loan, the backend has processed it, but hasn't approved it and the user hasn't consented to accept the amount that the backend has approved. Now, since it is manual, that poses problems

In this case, we put a pending approval screen up
   */

  /* If the amount is greater than 0 and approved is true, but consent is false, then we put up the consent modal*/

  if (loanData!.Amount > 0) {
    if (loanData?.Approved == false && loanData?.Consent == false) {
      return <PendingReview />;
    }

    if (loanData?.Approved == true && loanData?.Consent == false) {
      return <AwaitingConsent />;
    }
  }

  /* If the loan amount has been disbuursed, then it's about the user repaying their loan */

  if (accountDetails!.totalLoan > 0) {
    return <LoanIsOwed />;
  }
};

/* The default screen is that the user can collect a loan, in this screen, we assert that the amount is 0, approved is false, consent is false and totalLoan is 0 as well
 */

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
// };
export default Loans;
