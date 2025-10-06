import React from 'react'
import styles from './ms.module.css'
import Modal from '../Modal'

interface ModalSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  loanAmount: number;
  loanPurpose: string;
  loanDuration: string;
  onSubmit: () => void;
}

const ModalSummary: React.FC<ModalSummaryProps> = ({
  isOpen,
  onClose,
  loanAmount,
  loanPurpose,
  loanDuration,
  onSubmit
}) => {
  return (
    <div>
        <Modal onClose={onClose} isOpen={isOpen}>
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
              accounts in the event that you default with your loan refund.
            </p>
            <button
              className={styles.button2}
              onClick={onSubmit}
            >
              Get Loan
            </button>
          </div>
        </Modal>
    </div>
  )
}

export default ModalSummary