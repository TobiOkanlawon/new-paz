import useUser from "@/store/userStore";
import styles from "./pendingreview.module.css";
import { Loading } from "../Loading";
import { ErrorComponent } from "../Error";
import { useGetLoanStatus } from "@/data/queries/useGetLoanStatus";
import { useGetWallet } from "@/data/queries/useGetWallet";
import LoanBalanceCard from "@/components/PendingReviewLoanBalance";
import RecentActivity from "../Shared/RecentActivity";

const PendingReview = () => {
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
    </>
  );
};

export default PendingReview;
