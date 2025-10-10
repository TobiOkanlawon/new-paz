'use client'
import React, { useState, ReactNode } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './totalBalanceCard.module.css'
import Image from 'next/image'
import { FaPlus } from 'react-icons/fa'
import Modal from '../Modal/index'
import InputGroup from '../InputGroup'
import SelectGroup from '../InputGroup/SelectGroup';
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

  // Withdraw formik and validation
  const withdrawFormik = useFormik({
    initialValues: {
      amount: '',
      account: '',
    },
    validationSchema: Yup.object({
      amount: Yup.number().typeError('Amount must be a number').required('Amount is required').positive('Amount must be positive'),
      account: Yup.string().required('Account is required'),
    }),
    onSubmit: (values, actions) => {
      setShowModal2(false);
      actions.resetForm();
    },
  });



  const handleToggle = () => setShowMoney((prev) => !prev);
  const handleButtonClick = () => setShowModal(true);
  const handleButtonClick2 = () => setShowModal2(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseModal2 = () => setShowModal2(false);

  const banks = [
    { value: 'bank1', label: 'Bank 1' },
    { value: 'bank2', label: 'Bank 2' },
    { value: 'bank3', label: 'Bank 3' },
  ];
  // Default modal content if none is passed
  // Default modal content if none is passed
  const defaultModalContent = (
    <form className={styles.modalContainer} onSubmit={topupFormik.handleSubmit}>
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
          label='Select account to withdraw from'
          placeholder='Select bank to withdraw from'
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

  const pendingModalContent = (
    <form className={styles.modalContainer} onSubmit={withdrawFormik.handleSubmit}>
      <h2>Withdraw Funds</h2>
      <p>Get funds from your savings by filling the form below</p>
      <div className={styles.modalFormContainer}>
        <InputGroup
          label='Withdrawal amount*'
          placeholder='Enter how much you want to withdraw'
          id='amount'
          type='number'
          value={withdrawFormik.values.amount}
          onChange={withdrawFormik.handleChange}
          onBlur={withdrawFormik.handleBlur}
        />
        {withdrawFormik.touched.amount && withdrawFormik.errors.amount && (
          <div style={{ color: 'red', fontSize: '0.8rem' }}>{withdrawFormik.errors.amount}</div>
        )}
        <SelectGroup
          label='Select account to domicile cash*'
          placeholder='Select bank to withdraw from'
          id='account'
          value={withdrawFormik.values.account}
          onChange={withdrawFormik.handleChange}
          onBlur={withdrawFormik.handleBlur}
          options={banks}
        />
        {withdrawFormik.touched.account && withdrawFormik.errors.account && (
          <div style={{ color: 'red', fontSize: '0.8rem' }}>{withdrawFormik.errors.account}</div>
        )}
        <Link href={'#'}>Add new debit-card</Link>
      </div>
      <button type='submit'>Withdraw</button>
    </form>
  );

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
                onCancelPending && onCancelPending()
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