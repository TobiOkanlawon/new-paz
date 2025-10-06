import React,{useState} from 'react'
import styles from './loanheader.module.css'
import SavingsAlert from '../SavingsAlert'
import LoanBalanceCard from '../LoanBalance'

type LoanStatus = "non" | "pending" | "approved" | "withdrawn" | "repaid";

interface LoanHeaderProp {
    isFirstLoan: boolean,
    handleModalOpen: () => void,
    loanAmount: number,
    loanStatus: LoanStatus,
    setLoanStatus: (status: LoanStatus) => void
}

const LoanHeader = (props: LoanHeaderProp) => {
  const {
    isFirstLoan,
    handleModalOpen,
    loanAmount,
    loanStatus,
    setLoanStatus
  } = props;

  return (
    <div className={styles.container}>
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
    </div>
  )
}

export default LoanHeader   