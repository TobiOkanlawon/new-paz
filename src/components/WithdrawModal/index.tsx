import React from 'react'
import styles from './WithdrawModal.module.css'
import InputGroup from '../InputGroup'
import Link from 'next/link'

interface WithdrawModalProps {
  onSubmit?: () => void; // Make onSubmit optional
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onSubmit }) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ...your withdraw logic...
    if (onSubmit) {
      onSubmit(); // Call parent callback if provided
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className={styles.modalContainer}>
        <h2>Withdraw Funds</h2>
        <p>Get funds from your savings by filling the form below</p>
        <div className={styles.modalFormContainer}>
        <InputGroup
            label="Withdrawal amount*"
            placeholder="Enter how much you want to withdraw"
        />
        <InputGroup
            label="Select acount to domicile cash*"
            placeholder="Select ban to withdraw into"
        />
        <Link href={"#"}>Add new debit-card</Link>
        </div>
        <button type="submit">Withdraw</button>
    </form>
  )
}

export default WithdrawModal