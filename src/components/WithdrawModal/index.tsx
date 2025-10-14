import React, { useState } from "react";
import styles from "./WithdrawModal.module.css";
import InputGroup from "../InputGroup";
import Image from "next/image";
import * as Yup from "yup";
import { useFormik } from "formik";
import SelectGroup from "../InputGroup/SelectGroup";

interface WithdrawModalProps {
  onSubmit?: () => void; // Make onSubmit optional
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onSubmit }) => {
  const [inputActive, setInputActive] = useState(false);
  const handleClick = () => setInputActive(true);
  const formik = useFormik({
    initialValues: {
      amount: "",
      account: "",
      cardNumber: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive"),
      account: Yup.string().required("Account is required"),
    }),
    onSubmit: (values, actions) => {
      if (onSubmit) {
        onSubmit();
      }
      actions.resetForm();
    },
  });

  const banks = [
    { value: "bank1", label: "Bank 1" },
    { value: "bank2", label: "Bank 2" },
    { value: "bank3", label: "Bank 3" },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className={styles.modalContainer}>
      <h2>Withdraw Funds</h2>
      <p>Get funds from your savings by filling the form below</p>
      <div className={styles.modalFormContainer}>
        <InputGroup
          label="Withdrawal amount*"
          placeholder="Enter how much you want to withdraw"
          id="amount"
          type="number"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.amount && formik.errors.amount && (
          <div style={{ color: "red", fontSize: "0.8rem" }}>
            {formik.errors.amount}
          </div>
        )}
        <SelectGroup
          label="Select account to withdraw from"
          placeholder="Select bank to withdraw from"
          id="account"
          value={formik.values.account}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={banks}
        />
        {formik.touched.account && formik.errors.account && (
          <div style={{ color: "red", fontSize: "0.8rem" }}>
            {formik.errors.account}
          </div>
        )}
        <div
          style={inputActive ? { display: "flex" } : { display: "none" }}
          className={styles.addCard}
        >
          <Image src={"/visa.png"} alt={"Visa icon"} height={24} width={24} />
          <input
            type="text"
            name="cardNumber"
            id="cardNumber"
            placeholder="Visa Card ******************657"
            value={formik.values.cardNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <span
          style={inputActive ? { display: "none" } : { display: "block" }}
          onClick={handleClick}
        >
          Add new debit-card
        </span>
      </div>
      <button type="submit">Withdraw</button>
    </form>
  );
};

export default WithdrawModal;
