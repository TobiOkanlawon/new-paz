import React, {useState} from 'react'
import styles from './WithdrawApproved.module.css'
import Modal from '../Modal'
import Image from 'next/image'


const WithdrawApproved = () => {

  const [isActive, setIsActive] = useState(true)
 
  const handleClick = () => {
    setIsActive(false)
  }

  return (
    <Modal isOpen={isActive} onClose={() => {handleClick()}}>
      <div className={styles.modalContainer}>
        <Image
        src={'/confettiBall.png'}
        alt='Confetti Ball'
        height={90}
        width={90}
        />
        <h2>Withdraw Approved</h2>
        <p>Thank you for your time.</p>
        <div className={styles.buttonContainer}>
          <button onClick={handleClick}>Continue</button>
        </div>
      </div>
    </Modal>
  )
}

export default WithdrawApproved