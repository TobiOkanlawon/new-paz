import { useGetLoanStatus } from "@/data/queries/useGetLoanStatus";
import { ErrorComponent } from "../Error";
import { Loading } from "../Loading";
import LoanBalanceCard from "../PendingReviewLoanBalance";
import styles from "./awaitingconsent.module.css";
import { useGetWallet } from "@/data/queries/useGetWallet";
import useUser from "@/store/userStore";
import RecentActivity from "../Shared/RecentActivity";
import { useState } from "react";
import ConsentModal from "./ConsentModal";
import useConsentToLoan from "@/data/mutations/useConsentToLoan";

const AwaitingConsent = () => {
  const { user } = useUser();

  const {
    data: walletData,
    isLoading: i,
    error: e,
  } = useGetWallet(user?.email as string);

  const {
    data: loanData,
    isLoading,
    error,
  } = useGetLoanStatus(walletData!.walletId);

  // TODO: currently, there's no way to get the ID for the loans
  const mutation = useConsentToLoan("1");

  const [isOpen, setIsOpen] = useState(true);

  const handleAcceptLoan = () =>
    mutation.mutate({
      consent: true,
    });

  if (isLoading || i) return <Loading />;

  if (error || e) return <ErrorComponent />;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Loans</h1>
            <p>Explore all our loan options here.</p>
          </div>
        </div>
        <div className={styles.totalAmountCardContainer}>
          <LoanBalanceCard amount={loanData!.Amount} />
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.pendingReviewContainer}>
            <RecentActivity />
          </div>
        </div>
      </div>
      <ConsentModal
        tenure={loanData!.Tenor}
        amount={loanData!.Amount}
        handleTakeLoan={handleAcceptLoan}
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
      />
    </>
  );
};

export default AwaitingConsent;
