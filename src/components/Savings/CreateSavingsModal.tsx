"use client";

import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import ModalShell from "@/components/ModalShell/ModalShell";
import Input from "@/components/Input";
import Button from "@/components/Button";

import styles from "./createSavingsAccountModal.module.css";
import { handleErrorDisplay } from "@/libs/helpers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    accountName: string;
    initialDeposit: number;
    contributionFrequency: string;
    contributionAmount: number;
  }) => Promise<void>;
}

const validationSchema = yup.object({
  accountName: yup.string().required("Account name is required"),

  initialDeposit: yup
    .number()
    .typeError("Enter a valid amount")
    .required("Initial deposit is required")
    .min(1000, "Minimum deposit is 1,000"),

  contributionFrequency: yup.string().required("Select a frequency"),

  contributionAmount: yup
    .number()
    .typeError("Enter a valid amount")
    .required("Contribution amount is required")
    .min(500, "Minimum contribution is 500"),
});

const CreateSoloSaversModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      accountName: "",
      initialDeposit: "",
      contributionFrequency: "Monthly",
      contributionAmount: "",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSubmit({
          accountName: values.accountName,
          initialDeposit: Number(values.initialDeposit),
          contributionFrequency: values.contributionFrequency,
          contributionAmount: Number(values.contributionAmount),
        });

        onClose();
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <ModalShell
      title="Valentine Savings Account"
      open={isOpen}
      onClose={onClose}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Enter your details to create your vacation solo saver account</p>
        </div>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <Input
            label="Account Name"
            name="accountName"
            placeholder="Valentine Savings"
            value={formik.values.accountName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={handleErrorDisplay(formik, "accountName")}
          />

          <Input
            label="Initial Deposit"
            placeholder="10,000.00"
            {...formik.getFieldProps("initialDeposit")}
            errors={handleErrorDisplay(formik, "initialDeposit")}
          />

          <div className={styles.selectField}>
            <label>Contribution Frequency</label>

            <select
              name="contributionFrequency"
              value={formik.values.contributionFrequency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <Input
            label="Contribution Amount"
            name="contributionAmount"
            placeholder="5,000.00"
            value={formik.values.contributionAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={handleErrorDisplay(formik, "contributionAmount")}
          />

          <div className={styles.buttons}>
            <Button
              type="button"
              className={styles.backButton}
              onClick={onClose}
            >
              Back
            </Button>

            <Button type="submit" disabled={formik.isSubmitting}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
};

export default CreateSoloSaversModal;
