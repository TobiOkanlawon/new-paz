'use client'
import React, {useState} from 'react'
import styles from './acm.module.css'
import Modal from '../Modal';
import Button from '../Button';
import { LuArrowLeft } from 'react-icons/lu';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';

interface acmPropTypes {
  isOpen: boolean;
  onClose: () => void;
}

// Validation schema
const validationSchema = Yup.object().shape({
  accountNumber: Yup.string()
    .required('Account Number is required')
    .matches(/^\d{10}$/, 'Account Number must be exactly 10 digits'),
  accountName: Yup.string()
    .required('Account name is required')
    .min(8, 'Account name must be at least 8 characters'),
  bank: Yup.string()
    .required('Bank Name is required'),
});

const Account_Modal: React.FC<acmPropTypes> = ({ isOpen, onClose }) => {
    const [isAccountConfirmed, setIsAccountConfirmed] = useState(false)
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        {
            isAccountConfirmed ? (
                <div className={styles.success}>
                    <Image
                        src={'/confettiBall.png'}
                        alt=''
                        height={90}
                        width={90}
                        className={styles.confetti}
                    />
                    <h1 className={styles.modalHeader}>Success!</h1>
                    <p className={styles.modalDetails}>Your Account has been added!</p>
                    
                    <div className={styles.backContainer} onClick={onClose}>
                        <LuArrowLeft />
                        <p>Back</p>
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className={styles.modalHeader}>Add your Account</h1>
                    <p className={styles.modalDetails}>You can verify your identity on PAZ</p>
            
                    <Formik
                    initialValues={{ accountNumber: '', accountName: '', bank: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        console.log('Form Submitted:', values);
                        // Add actual submit logic here (API call, etc)
                        actions.setSubmitting(false);
                    }}
                    >
                    {({ isSubmitting }) => (
                        <Form className={styles.formContainer}>
                        <div className={styles.inputGroup}>
                            <label className={styles.labels} htmlFor="accountName">Account Name</label>
                            <Field
                            className={styles.inputs}
                            type="text"
                            name="accountName"
                            placeholder="Enter your account name"
                            />
                            <ErrorMessage
                            name="accountName"
                            component="div"
                            className={styles.errorText}
                            />
                        </div>
            
                        <div className={styles.inputGroup}>
                            <label className={styles.labels} htmlFor="accountNumber">Account Number</label>
                            <Field
                            className={styles.inputs}
                            type="text"
                            name="accountNumber"
                            id="accountNumber"
                            placeholder='Account Number'
                            />
                            <ErrorMessage
                            name="accountNumber"
                            component="div"
                            className={styles.errorText}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.labels} htmlFor="Bank">Bank</label>
                            <Field
                            className={styles.inputs}
                            type="text"
                            name="bank"
                            id="bank"
                            placeholder='Bank Name'
                            />
                            <ErrorMessage
                            name="bank"
                            component="div"
                            className={styles.errorText}
                            />
                        </div>
            
                        <div className={styles.buttonContainer}>
                            <Button
                            label="Add Account"
                            loading={isSubmitting}
                            className={styles.submitButton}
                            />
                        </div>
            
                        <div className={styles.backContainer} onClick={onClose}>
                            <LuArrowLeft />
                            <p>Back</p>
                        </div>
                        </Form>
                    )}
                    </Formik>
                </div>
            )
        }
      </Modal>
    </div>
  );
};

export default Account_Modal;
