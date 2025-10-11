import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./TopupModal.module.css";
import InputGroup from "../InputGroup";
import SelectGroup from "../InputGroup/SelectGroup";
import Image from "next/image";

const banks = [
  { value: "bank1", label: "Bank 1" },
  { value: "bank2", label: "Bank 2" },
  { value: "bank3", label: "Bank 3" },
];

const TopUpModal = () => {
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
        .typeError("Amount must be a number")
        .required("Amount is required")
        .positive("Amount must be positive"),
      account: Yup.string().required("Account is required"),
      cardNumber: Yup.string(),
    }),
    onSubmit: (values, actions) => {
      setInputActive(false);
      actions.resetForm();
    },
  });

  return (
    <form className={styles.modalContainer} onSubmit={formik.handleSubmit}>
      <h2>Top-up your savings</h2>
      <p>Save up that money you do want to regret spending</p>
      <div className={styles.modalFormContainer}>
        <InputGroup
          label="Top-up amount*"
          placeholder="Enter how much you want to top-up"
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
      <button type="submit">Save</button>
    </form>
  );
};

export default TopUpModal;
