import React from 'react'
import styles from './em.module.css'
import Modal from '../Modal'
import FileUploader from '../FIleInput'

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAboveThreshold: boolean;
  eligibleAmount: number;
  onContinue: () => void;
  onTakeLoan: () => void;
}

const EligibilityModal: React.FC<EligibilityModalProps> = ({
  isOpen,
  onClose,
  isAboveThreshold,
  eligibleAmount,
  onContinue,
  onTakeLoan
}) => {
  return (
    <div>
        <Modal
          onClose={onClose}
          isOpen={isOpen}
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
                onClick={onContinue}
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
                onClick={onTakeLoan}
              >
                Take Loan
              </button>
            </div>
          )}
        </Modal>
    </div>
  )
}

export default EligibilityModal