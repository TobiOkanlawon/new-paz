import { useState } from "react";
import styles from "./styles.module.css";
import useAccountDetails from "@/store/accountStore";
import LoanBalanceCard from "@/components/LoanBalance/index";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
import useUser from "@/store/userStore";
import { Loading } from "@/components/Loading";
import { ErrorComponent } from "@/components/Error";

type LoanStatus = "non" | "pending" | "approved" | "withdrawn" | "repaid";

const LoanIsOwed = () => {
  const { user } = useUser();
  const { error, isLoading, data } = useGetAccountDetails(
    user?.email as string,
  );
  const [loanStatus, setLoanStatus] = useState<LoanStatus>("non");

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorComponent
        message="An error occured while trying to get account details"
        retryFunction={() => {}}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Loans</h1>
          <p>Explore all our loan options here.</p>
        </div>
      </div>

      <div>
        <div className={styles.totalAmountCardContainer}>
          <LoanBalanceCard
            loanAmount={data?.TotalLoan as number}
            loanStatus={loanStatus}
            onUpdateStatus={setLoanStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default LoanIsOwed;
