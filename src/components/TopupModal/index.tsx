import React, { useState } from 'react'
import styles from './TopupModal.module.css'
import InputGroup from '../InputGroup'
import Image from 'next/image'

const TopUpModal = () => {
  const [inputActive, setInputActive] = useState(false)
  const handleClick = () => {
    setInputActive(true)
  }
  return (
    <div className={styles.modalContainer}>
        <h2>Top-up your savings</h2>
        <p>Save up that money you do want to regret spending</p>
        <div className={styles.modalFormContainer}>
        <InputGroup
            label="Top-up amount*"
            placeholder="Enter how much you want to top-up"
        />
        <InputGroup
            label="Select account to withdraw from*"
            placeholder="Select ban to withdraw into"
        />
        <div style={inputActive ? {display: 'flex'} : {display: 'none'}} className={styles.addCard}>
          <Image
            src={'/visa.png'}
            alt={'Visa icon'}
            height={24}
            width={24}
            />
          <input type="text" name="cardNumber" id="cardNumber" placeholder='Visa Card ******************657' />
        </div>
        <span style={inputActive ? {display: 'none'} : {display: 'block'}} onClick={handleClick}>Add new debit-card</span>
        </div>
        <button>Save</button>
    </div>
  )
}

export default TopUpModal