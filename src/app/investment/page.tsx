'use client'
import React, {useState} from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './investment.module.css'
import InvestmentBalanceCard from '@/components/InvestmentBalanceCard'
import Modal from '@/components/Modal'
import InputGroup from '@/components/InputGroup'
import SelectGroup from '@/components/InputGroup/SelectGroup'

const Investment = () => {
    const investmentPlans = [
        {id: 'plan1', name: 'Nigerian EuroBond Funds', description: 'United capital value investment', returns: '0.06', risk: 'Moderate'},
        {id: 'plan2', name: 'Nigerian EuroBond Funds', description: 'United capital value investment', returns: '0.06', risk: 'Moderate'},
        {id: 'plan3', name: 'Nigerian EuroBond Funds', description: 'United capital value investment', returns: '0.06', risk: 'Moderate'},
        {id: 'plan4', name: 'Nigerian EuroBond Funds', description: 'United capital value investment', returns: '0.06', risk: 'Moderate'},
    ]
    const banks = [
        {id: 'bank1', value: 'bank1', name: 'United Bank for Africa'},
        {id: 'bank2', value: 'bank2', name: 'First Bank of Nigeria'},
        {id: 'bank3', value: 'bank3', name: 'Zenith Bank'},
        {id: 'bank4', value: 'bank4', name: 'Access Bank'},
        {id: 'bank5', value: 'bank5', name: 'Guaranteed Trust Bank'},
    ]
    type InvestmentPlan = {
        id: string;
        name: string;
        description: string;
        returns: string;
        risk: string;
    };
    const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInvestments, setUserInvestments] = useState<any[]>([]);
    const [showTopup, setShowTopup] = useState(false);

    const formik = useFormik({
      initialValues: {
        amount: '',
        bank: '',
        accountNumber: '',
      },
      validationSchema: Yup.object({
        amount: Yup.number().typeError('Amount must be a number').required('Amount is required').positive('Amount must be positive'),
        bank: Yup.string().required('Bank is required'),
        accountNumber: Yup.string().required('Account number is required').matches(/^\d{10,}$/, 'Account number must be at least 10 digits'),
      }),
      onSubmit: (values, actions) => {
        setUserInvestments(prev => [
          ...prev,
          {
            ...selectedPlan,
            investedAmount: values.amount,
            bank: values.bank,
            accountNumber: values.accountNumber,
          }
        ]);
        setIsModalOpen(false);
        setShowTopup(true);
        actions.resetForm();
      },
    });

    const ModalContent =  (
      <form className={styles.modalContent} onSubmit={formik.handleSubmit}>
        {selectedPlan && (
          <>
            <h2>{selectedPlan?.name}</h2>
            <p>Find out your credit score; Just about how credit worthy you are.</p>
            <InputGroup
              label="Investment Amount*"
              placeholder="Enter amount"
              id="amount"
              type="number"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.amount && formik.errors.amount && (
              <div style={{ color: 'red', fontSize: '0.8rem' }}>{formik.errors.amount}</div>
            )}
            <SelectGroup
              label="Payment Source*"
              options={banks.map(bank => ({ value: bank.id, label: bank.name }))}
              placeholder="Select a bank"
              id="bank"
              value={formik.values.bank}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.bank && formik.errors.bank && (
              <div style={{ color: 'red', fontSize: '0.8rem' }}>{formik.errors.bank}</div>
            )}
            <InputGroup
              label='Account Number*'
              placeholder='Enter your account number'
              id='accountNumber'
              value={formik.values.accountNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.accountNumber && formik.errors.accountNumber && (
              <div style={{ color: 'red', fontSize: '0.8rem' }}>{formik.errors.accountNumber}</div>
            )}
          </>
        )}
        <button type="submit">Invest</button>
      </form>
    );
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Investments</h1>
      <p className={styles.headerText}>Explore all our Investment plans here.</p>

      <div className={styles.investmentBalanceContainer}>
        {showTopup && (
          <InvestmentBalanceCard
            header="Your Investment"
            money={userInvestments.length > 0 ? userInvestments[userInvestments.length-1].investedAmount : 0}
            buttonText="Instant Topup"
          />
        )}
        <InvestmentBalanceCard
          header="Investment Balance"
          // money={100000000}
        />
      </div>

      {
        showTopup && (
          <>
            {userInvestments.map((inv, idx) => (
              <div key={inv.id + idx} className={styles.investmentCard} style={{width: '380px', margin: '1rem 0'}}>
                <img src="/activityLogo2.png" alt="" />
                <h3>{inv.name}</h3>
                <p>{inv.description}</p>
            <div className={styles.investmentDetails}>
                <p>YTD Returns: <span className={styles.returns}>{inv.returns}</span></p>
                <p>Risk: <span className={styles.risk}>{inv.risk}</span></p>
            </div>
          </div>
          ))}
        </>
        )
      }

      <div className={styles.filterContainer}>
           <label htmlFor="options">Filter</label>
           <select name="options" id="options" className={styles.filterSelect}>
               <option value="default">Select an option</option>
               <option value="active">Active</option>
               <option value="completed">Completed</option>
           </select>
      </div>

      <div className={styles.investmentCardsContainer}>
        {investmentPlans.map((plan) => (
          <form key={plan.id} className={styles.investmentCard}>
            <img src="/activityLogo2.png" alt="" />
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <div className={styles.investmentDetails}>
                <p>YTD Returns: <span className={styles.returns}>{plan.returns}</span></p>
                <p>Risk: <span className={styles.risk}>{plan.risk}</span></p>
            </div>
            <button type="button" onClick={() => {setSelectedPlan(plan); setIsModalOpen(true);}}>Invest Now</button>
          </form>
        ))}
      </div>
      {
        selectedPlan && isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {ModalContent}
          </Modal>
        )
      }
    </div>
  )
}

export default Investment