'use client'
import React, { useState, ReactNode } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './investment.module.css'
import Image from 'next/image'
import { FaPlus } from 'react-icons/fa'
import Modal from '../Modal/index'
import InputGroup from '../InputGroup'
import SelectGroup from '../InputGroup/SelectGroup';

interface InvestmentBalanceCardProps {
  header: string;
  money?: number;
  buttonText?: string; // Optional button text
  modalContent?: ReactNode; // Optional modal content
}

const InvestmentBalanceCard: React.FC<InvestmentBalanceCardProps> = ({ header, money, buttonText, modalContent}) => {
  const [showMoney, setShowMoney] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isToppedUp, setIsToppedUp] = useState(true)
  const safeMoney = typeof money === 'number' ? money : 0;

  // Top-up formik and validation
  const [inputActive, setInputActive] = useState(false);
  const topupFormik = useFormik({
    initialValues: {
      amount: '',
      account: '',
      cardNumber: '',
    },
    validationSchema: Yup.object({
      amount: Yup.number().typeError('Amount must be a number').required('Amount is required').positive('Amount must be positive'),
      account: Yup.string().required('Account is required'),
      cardNumber: Yup.string(),
    }),
    onSubmit: (values, actions) => {
      setIsToppedUp(true);
      handleCloseModal();
      setInputActive(false);
      actions.resetForm();
    },
  });


  const handleToggle = () => setShowMoney((prev) => !prev);
  const handleButtonClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const banks = [
    { value: 'bank1', label: 'Bank 1' },
    { value: 'bank2', label: 'Bank 2' },
    { value: 'bank3', label: 'Bank 3' },
  ];

  const defaultModalContent = (
    <form className={`${styles.modalContainer} ${styles.savingModal}`} style={{textAlign: 'start'}} onSubmit={topupFormik.handleSubmit}>
      <h2>Top-up your savings</h2>
      <p>Save up that money you do want to regret spending</p>
      <div className={styles.modalFormContainer}>
        <InputGroup
          label='Top-up amount*'
          placeholder='Enter how much you want to top-up'
          id='amount'
          type='number'
          value={topupFormik.values.amount}
          onChange={topupFormik.handleChange}
          onBlur={topupFormik.handleBlur}
        />
        {topupFormik.touched.amount && topupFormik.errors.amount && (
          <div style={{ color: 'red', fontSize: '0.8rem' }}>{topupFormik.errors.amount}</div>
        )}
        <SelectGroup
          label='Select account to withdraw from*'
          placeholder='Select bank to withdraw into'
          id='account'
          value={topupFormik.values.account}
          onChange={topupFormik.handleChange}
          onBlur={topupFormik.handleBlur}
          options={banks}
        />
        {topupFormik.touched.account && topupFormik.errors.account && (
          <div style={{ color: 'red', fontSize: '0.8rem' }}>{topupFormik.errors.account}</div>
        )}
        <div style={inputActive ? {display: 'flex'} : {display: 'none'}} className={styles.addCard}>
          <Image
            src={'/visa.png'}
            alt={'Visa icon'}
            height={24}
            width={24}
          />
          <input
            type="text"
            name="cardNumber"
            id="cardNumber"
            placeholder='Visa Card ******************657'
            value={topupFormik.values.cardNumber}
            onChange={topupFormik.handleChange}
            onBlur={topupFormik.handleBlur}
          />
        </div>
        <span style={inputActive ? {display: 'none'} : {display: 'block'}} onClick={() => setInputActive(true)}>Add new debit-card</span>
      </div>
      <button type='submit'>Save</button>
    </form>
  );

  return (
    <div className={styles.investmentBalanceCard}>
      <p>{header}</p>
      <div className={styles.contentContainer}>
        <h3>
          ₦ {showMoney ? (safeMoney.toLocaleString()) : '****'}{' '}
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
          <button className={styles.cardButton} onClick={handleButtonClick}>
            {buttonText} <FaPlus />
          </button>
        )}
      </div>
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          {
              modalContent ? modalContent : defaultModalContent
          }
        </Modal>
      )}
    </div>
  )
}

export default InvestmentBalanceCard