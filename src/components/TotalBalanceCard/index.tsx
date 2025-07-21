'use client'
import React, { useState, ReactNode } from 'react'
import styles from './totalBalanceCard.module.css'
import Image from 'next/image'
import { FaPlus } from 'react-icons/fa'
import Modal from '../Modal/index'
import InputGroup from '../InputGroup'
import Link from 'next/link'

interface TotalBalanceCardProps {
  header: string;
  money?: number;
  buttonText?: string; // Optional button text
  modalContent?: ReactNode; // Optional modal content
  isPending?: boolean;
  onCancelPending?: () => void;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({ header, money, buttonText, modalContent, isPending, onCancelPending}) => {
  const [showMoney, setShowMoney] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [isToppedUp, setIsToppedUp] = useState(true)
  const safeMoney = typeof money === 'number' ? money : 0;

  const handleToggle = () => setShowMoney((prev) => !prev);
  const handleButtonClick = () => setShowModal(true);
  const handleButtonClick2 = () => setShowModal2(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseModal2 = () => setShowModal2(false);


  // Default modal content if none is passed
  const defaultModalContent = (
    <div className={styles.modalContainer}>
      <h2>Top-up your savings</h2>
      <p>Save up that money you do want to regret spending</p>
      <div className={styles.modalFormContainer}>
        <InputGroup label='Top-up amount*' placeholder='Enter how much you want to top-up' />
        <InputGroup label='Select account to withdraw from*' placeholder='Select ban to withdraw into' />
        <Link href={'#'}>Add new debit-card</Link>
      </div>
      <button onClick={ () =>{
        if(isToppedUp){
          handleCloseModal()
        }
      }
      }>Save</button>
    </div>
  );
  const pendingModalContent = (
    <div className={styles.modalContainer}>
      <h2>Cancel pending withdrawal</h2>
      <p>Do you really want to cancel your pending withdrawal?</p>
      <button onClick={ () =>{
        if(isToppedUp){
          handleCloseModal2();
          // handleStopPending();
          onCancelPending?.();
        }
      }
      }>Continue</button>
    </div>
  )

  return (
    <div style={isPending ? { minWidth: '45vw', flexGrow: '1' } : undefined} className={styles.totalBalanceCard}>
      <p>{header}</p>
      <div className={styles.contentContainer}>
        <h3>
          ₦ {showMoney ? safeMoney.toLocaleString() : '****'}{' '}
          <span>
            <Image
              src={showMoney ? '/eyeOff.png' : '/eyeOff.png'}
              alt='Money Toggle'
              width={12}
              height={12}
              style={{ cursor: 'pointer' }}
              onClick={handleToggle}
            />
          </span>
        </h3>
        {buttonText && (
          <button style={isPending ? {width: '70%'} : {width: '100%'}}  className={styles.cardButton} onClick={handleButtonClick}>
            {buttonText} <FaPlus />
          </button>
        )}
        {
          isPending && (
            <div className={styles.pendingContainer}>
              <p>Pending withdrawal</p>
              <button onClick={() => {
                handleButtonClick2()
              }}>Cancel</button>
            </div>
          )
        }
      </div>
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          {
              modalContent ? modalContent : defaultModalContent
          }
        </Modal>
      )}
      {
        isPending && (
          <Modal isOpen={showModal2} onClose={handleCloseModal2}>
            {
              pendingModalContent
            }
          </Modal>
        )
      }
    </div>
  )
}

export default TotalBalanceCard