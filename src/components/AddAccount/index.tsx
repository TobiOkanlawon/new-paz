"use client";
import React, { useEffect, useState } from "react";
import styles from "./acm.module.css";
import Modal2 from "../Modal2";
import Button from "../Button";
import { LuArrowLeft } from "react-icons/lu";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import Input from "../Input";
import { useAddAccount } from "@/data/mutations/useAddAccount";
import useUser from "@/store/userStore";
import { useGetWallet } from "@/data/queries/useGetWallet";
import { Loading } from "../Loading";
import { ErrorComponent } from "../Error";

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
  const mutation = useAddAccount();

  const { user, setUser } = useUser();

  const { data, isLoading, error } = useGetWallet(isOpen ? (user?.email as string) : "");

  return (
    <div className={styles.container}>
      <Modal2 isOpen={isOpen} isLoading={isLoading}>
        <div className={styles.modalWrapper}>
          <h1 className={styles.modalHeader}>Add your Account</h1>
          <p className={styles.modalDetails}>
            You can verify your identity on PAZ
          </p>

          <Formik
            initialValues={{ accountNumber: "", accountName: "", bank: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              mutation.mutate(
                {
                  accountNo: values.accountNumber,
                  accountName: values.accountName,
                  bankName: values.bank,
                  walletId: data?.walletId as string,
                },
                {
                  onSuccess: () => {
                    setUser({ primary_account_linked: true });
                    onClose();
                  },
                },
              );

              actions.setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className={styles.formContainer}>
                <div className={styles.inputGroup}>
                  <Field name="accountName">
                    {({ field, meta }: FieldProps) => (
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
                    {({ field, meta }: FieldProps) => (
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
                    {({ field, meta }: FieldProps) => (
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
                    type="submit"
                    label="Add Account"
                    loading={isSubmitting}
                    className={styles.submitButton}
                    onClick={() => {
                      console.log("hey submit me");
                    }}
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
      </Modal2>
    </div>
  );
};

export default AccountModal;
