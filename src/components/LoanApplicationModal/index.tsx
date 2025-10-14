import React from 'react'
import styles from './lam.module.css'
import Modal from '../Modal'
import SelectGroup from '../InputGroup/SelectGroup'
import Input from '../Input'
import { useFormik } from "formik";
import * as yup from "yup";


interface LoanApplicationModalProps {
    handleModalClose: () => void;
    isModalOpen: boolean;
    onSubmit: (values: LoanSchema) => void;
}

const schema = yup.object({
  purpose: yup.string().required("Please select a purpose for the loan"),
  amount: yup
    .number()
    .required("Please enter the amount you need")
    .positive("Amount must be positive")
    .integer("Amount must be an integer"),
  duration: yup.string().required("Please select a loan duration"),
});

type LoanSchema = yup.InferType<typeof schema>;


const LoanApplicationModal = (props: LoanApplicationModalProps) => {
   const {
        handleModalClose, 
        isModalOpen,
        onSubmit
    } = props;

   const formik = useFormik<LoanSchema>({
    initialValues: {
      purpose: "",
      amount: 1000,
      duration: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <div>
        <Modal onClose={handleModalClose} isOpen={isModalOpen}>
          <h1 className={styles.modalTitle}>Instant Loan Application Form</h1>
          <p className={styles.modalDescription}>
            Get instant loan quick and easy
          </p>
          <form onSubmit={formik.handleSubmit} className={styles.modalForm}>
            <SelectGroup
              id="purpose"
              label="Purpose of loan"
              options={[
                { label: "Personal", value: "personal" },
                { label: "Business", value: "business" },
              ]}
              placeholder="Select loan purpose"
              {...formik.getFieldProps("purpose")}
            />
            <Input
              id="amount"
              label="Amount"
              placeholder="Enter how much you need"
              {...formik.getFieldProps("amount")}
            />
            <SelectGroup
              id="duration"
              label="Loan duration"
              options={[
                { label: "1 month", value: "1month" },
                { label: "3 months", value: "3months" },
                { label: "6 months", value: "6months" },
              ]}
              placeholder="Select loan duration"
              {...formik.getFieldProps("duration")}
            />

            <div className={styles.modalButton}>
              <button type="submit">Check Eligibility</button>
            </div>
          </form>
        </Modal>
    </div>
  )
}

export default LoanApplicationModal