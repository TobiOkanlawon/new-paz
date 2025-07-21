import React, {useState} from 'react'
import styles from './WithdrawalConsent.module.css'
import Modal from '../Modal'


const WithdrawalConsent = () => {

  const [isActive, setIsActive] = useState(true)
 
  const handleClick = () => {
    setIsActive(false)
  }

  return (
    <Modal isOpen={isActive} onClose={() => {handleClick()}}>
      <div className={styles.modalContainer}>
        <h2>Withdrawal Consent for Biodun Olowo</h2>
        <p>Biodun Olowo who is also a member of the Olowo family that you belong to has requested to withdraw the sum of N200,000.00 from your family vault. Please confirm your consent below. Thank you.</p>
        <div className={styles.buttonContainer}>
          <button>Do not allow</button>
          <button>Allow withdrawal</button>
        </div>
      </div>
    </Modal>
  )
}

export default WithdrawalConsent