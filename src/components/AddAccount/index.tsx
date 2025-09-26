"use client";
import React, { useState } from "react";
import styles from "./acm.module.css";
import Modal from "../Modal";
import Button from "../Button";
import { LuArrowLeft } from "react-icons/lu";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "../Input";

interface acmPropTypes {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  accountNumber: Yup.string()
    .required("Account Number is required")
    .matches(/^\d{10}$/, "Account Number must be exactly 10 digits"),
  accountName: Yup.string()
    .required("Account name is required")
    .min(8, "Account name must be at least 8 characters"),
  bank: Yup.string().required("Bank Name is required"),
});

const AccountModal: React.FC<acmPropTypes> = ({ isOpen, onClose }) => {
  const [isAccountConfirmed, setIsAccountConfirmed] = useState(true);

  return (
    <div className={styles.container}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div>
          <h1 className={styles.modalHeader}>Add your Account</h1>
          <p className={styles.modalDetails}>
            You can verify your identity on PAZ
          </p>

          <Formik
            initialValues={{ accountNumber: "", accountName: "", bank: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              console.log("Form Submitted:", values);
              actions.setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className={styles.formContainer}>
                <div className={styles.inputGroup}>
                  <Field name="accountName">
                    {({ field, meta }: any) => (
                      <Input
                        label="Account Name"
                        placeholder="Enter your account name"
                        {...field}
                        errors={meta.touched && meta.error ? meta.error : ""}
                      />
                    )}
                  </Field>
                </div>

                <div className={styles.inputGroup}>
                  <Field name="accountNumber">
                    {({ field, meta }: any) => (
                      <Input
                        label="Account Number"
                        placeholder="Account Number"
                        {...field}
                        errors={meta.touched && meta.error ? meta.error : ""}
                      />
                    )}
                  </Field>
                </div>

                <div className={styles.inputGroup}>
                  <Field name="bank">
                    {({ field, meta }: any) => (
                      <Input
                        label="Bank"
                        placeholder="Bank Name"
                        {...field}
                        errors={meta.touched && meta.error ? meta.error : ""}
                      />
                    )}
                  </Field>
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
      </Modal>
    </div>
  );
};

export default AccountModal;
