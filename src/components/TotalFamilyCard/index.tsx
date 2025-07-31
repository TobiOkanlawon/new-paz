'use client'
import React, { useState, ReactNode } from 'react'
import styles from './totalFamilyCard.module.css'
import Image from 'next/image'
import { FaPlus } from 'react-icons/fa'
import Modal from '../Modal/index'
import InputGroup from '../InputGroup'
import Link from 'next/link'

interface totalFamilyCardProps {
  header: string;
  money?: number;
  buttonText?: string; // Optional button text
  modalContent?: ReactNode; // Optional modal content
}

const TotalFamilyCard: React.FC<totalFamilyCardProps> = ({ header, money, buttonText, modalContent }) => {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
      <button>Save</button>
    </div>
  );

  const familyMembers = [
    {key: 1, href: '/familyMember1.png'},
    {key: 2, href: '/familyMember2.png'},
    {key: 3, href: '/familyMember3.png'},
  ]

  return (
    <div className={styles.totalFamilyCard}>
      <p>{header}</p>
      <div className={styles.contentContainer}>
        <div>
          <h3>
            {familyMembers.length}
          </h3>
          <div className={styles.familyImages} >
            {
              familyMembers.map((member) => (
                <Image 
                src={member.href}
                alt={member.href}
                key={member.key}
                width={45}
                height={45}
                className={styles.cardImages}
                />
              ))
            }
          </div>
        </div>
        {buttonText && (
          <button className={styles.cardButton} onClick={handleButtonClick}>
            {buttonText} <FaPlus />
          </button>
        )}
      </div>
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          {modalContent ? modalContent : defaultModalContent}
        </Modal>
      )}
    </div>
  )
}

export default TotalFamilyCard