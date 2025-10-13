import { useState } from "react";
import styles from "./styles.module.css";
import LoanBalanceCard from "@/components/LoanBalance/index";
import InstantLoanCard from "../InstantLoanCard";
import LoanForm from "./LoanApplicationModal";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
import useUser from "@/store/userStore";

type LoanStatus = "non" | "pending" | "approved" | "withdrawn" | "repaid";

const CanAccessLoan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const { user } = useUser();
  const { TotalLoan } = useGetAccountDetails(user?.email as string);
  const [loanStatus, setLoanStatus] = useState<LoanStatus>("non");

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
            loanAmount={TotalLoan}
            loanStatus={loanStatus}
            onUpdateStatus={setLoanStatus}
          />
        </div>
        <div className={styles.subContainer}>
          <InstantLoanCard handleShowModal={handleModalOpen} />
        </div>
      </div>
      {isModalOpen && (
        <LoanForm
          isModalOpen={isModalOpen}
          handleModalOpen={handleModalOpen}
          handleModalClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default CanAccessLoan;
