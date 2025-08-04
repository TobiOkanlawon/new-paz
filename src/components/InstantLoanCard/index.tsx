import React from 'react'
import styles from './instantLoan.module.css'
import Image from 'next/image'

interface InstantLoanCardProps {
    handleModalOpen?: () => void;
    handleIsFirstLoan?: () => void;
}
const InstantLoanCard: React.FC<InstantLoanCardProps> = ({ handleModalOpen, handleIsFirstLoan }) => {
  return (
    <div className={styles.cardTypes}>
        <Image 
        src={'/loanCardImage.png'} 
        alt='Instant Loan Image'
        width={79}
        height={79}
        />
        <div>
            <h4>Instant loan</h4>
            <p>Save money regularly in a locked plan with interest of up to 12% per annum.</p>
            <button className={styles.startNowButton} onClick={() => {
                handleModalOpen?.();
                handleIsFirstLoan?.();
            }} >Get Loan</button>
        </div>
    </div>
  )
}

export default InstantLoanCard