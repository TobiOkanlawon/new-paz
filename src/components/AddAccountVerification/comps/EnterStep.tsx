"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import styles from "../addaccountverification.module.css";
import Input from "@/components/Input";
import { handleErrorDisplay } from "@/libs/helpers";
import { addAccount } from "@/actions/preAuth";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const validationSchema = yup.object({
  accountNumber: yup
    .string()
    .required("Account number is required")
    .length(10, "Account number must be 10 digits"),

  accountName: yup.string().required("Account name is required"),
  bankName: yup.string().required("You must supply the name of your bank"),
});

const EnterStep = ({
  onVerify,
  onBack,
}: {
  onVerify: (values: { accountNumber: string; accountName: string }) => void;
  onBack: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { update } = useSession();

  const formik = useFormik({
    initialValues: {
      accountNumber: "",
      accountName: "",
      bankName: "",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);

      const response = await addAccount(
        values.accountName,
        values.accountNumber,
        values.bankName,
      );

      if (!response.success) {
        toast.error(error.responseMessage);
        setSubmitting(false);
        return;
      }

      setIsLoading(false);

      update({
        primaryAccountLinked: true,
      });

      onVerify(values);
    },
  });

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);

    formik.setFieldValue("accountNumber", val);
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.header}>
        <h1 className={styles.title}>Enter Primary Account</h1>
        <p className={styles.subtitle}>
          Please enter your 10-digits Primary Bank Account Number
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className={styles.inputGroup}>
          <Input
            label="Account Number"
            name="accountNumber"
            placeholder="1234567890"
            inputMode="numeric"
            maxLength={10}
            value={formik.values.accountNumber}
            onChange={handleAccountNumberChange}
            onBlur={formik.handleBlur}
            errors={handleErrorDisplay(formik, "accountNumber")}
          />

          <span
            className={`${styles.charCount} ${
              formik.values.accountNumber.length === 10
                ? styles.charCountFull
                : ""
            }`}
          >
            {formik.values.accountNumber.length}/10 digits
          </span>
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Account Name"
            placeholder="Name of Account"
            {...formik.getFieldProps("accountName")}
            errors={handleErrorDisplay(formik, "accountName")}
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Bank Name"
            placeholder="Name of Account"
            {...formik.getFieldProps("bankName")}
            errors={handleErrorDisplay(formik, "bankName")}
          />
        </div>

        <div className={styles.btnRow}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={onBack}
          >
            Back
          </button>

          <button
            type="submit"
            className={`${styles.primaryBtn} ${styles.verifyBtn} ${
              formik.values.accountNumber.length !== 10
                ? styles.btnDisabled
                : ""
            }`}
            disabled={formik.values.accountNumber.length !== 10 || isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner} />
            ) : (
              "Add Account Details"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnterStep;
