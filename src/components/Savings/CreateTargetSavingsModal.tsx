"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import ModalShell from "@/components/ModalShell/ModalShell";
import Input from "@/components/Input";
import Button from "@/components/Button";
import styles from "./createSavingsAccountModal.module.css";
import { handleErrorDisplay } from "@/libs/helpers";
import SelectGroup from "../InputGroup/SelectGroup";
import ConfirmationDetailsModal from "@/components/Savings/ConfirmTargetSavingsDetails";

interface SubmitValues {
  accountName: string;
  initialDeposit: number;
  contributionFrequency: string;
  contributionAmount: number;

  targetAmount: number;
  targetDate: string;
  description: string;
}

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SubmitValues) => Promise<void>;
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

  targetAmount: yup
    .number()
    .typeError("Enter a valid target amount")
    .required("Target amount is required")
    .min(1000, "Target must be at least 1,000"),

  targetDate: yup.string().required("Target date is required"),

  description: yup.string().max(200, "Max 200 characters"),
});

const CreateTargetSaversModal: React.FC<Props> = ({
  title,
  isOpen,
  onClose,
  onSubmit,
}) => {
  // Controls which step is visible: "form" | "confirm"
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      accountName: "",
      initialDeposit: "",
      contributionFrequency: "Monthly",
      contributionAmount: "",
      targetAmount: "",
      targetDate: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // STEP 1 → Just go to confirm, STOP here
      if (step === "form") {
        setStep("confirm");
        return;
      }

      // STEP 2 → Actual submission
      setSubmitting(true);

      try {
        await onSubmit({
          accountName: values.accountName,
          initialDeposit: Number(values.initialDeposit),
          contributionFrequency: values.contributionFrequency,
          contributionAmount: Number(values.contributionAmount),
          targetAmount: Number(values.targetAmount),
          targetDate: values.targetDate,
          description: values.description,
        });

        resetForm();
        setStep("form");
        onClose();
      } catch (e) {
        console.error(e);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setStep("form");
    onClose();
  };

  const handleBackToEdit = () => setStep("form");

  return (
    <>
      {/* ── Step 1: Form ─────────────────────────────────── */}
      <ModalShell
        title={title}
        open={isOpen && step === "form"}
        onClose={handleClose}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <p>Enter your details to create your solo saver account</p>
          </div>
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            <Input
              label="Account Name"
              name="accountName"
              placeholder={title}
              value={formik.values.accountName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={handleErrorDisplay(formik, "accountName")}
            />

            {/* Description */}
            <Input
              label="Description (Optional)"
              name="description"
              placeholder="What are you saving for?"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={handleErrorDisplay(formik, "description")}
            />

            <Input
              label="Initial Deposit"
              placeholder="10,000.00"
              {...formik.getFieldProps("initialDeposit")}
              errors={handleErrorDisplay(formik, "initialDeposit")}
            />
            <SelectGroup
              label="Contribution Frequency"
              placeholder="Monthly"
              options={[
                { label: "Daily", value: "Daily" },
                { label: "Weekly", value: "Weekly" },
                { label: "Monthly", value: "Monthly" },
                { label: "Yearly", value: "Yearly" },
              ]}
              {...formik.getFieldProps("contributionFrequency")}
              errors={handleErrorDisplay(formik, "contributionFrequency")}
            />
            <Input
              label="Contribution Amount"
              name="contributionAmount"
              placeholder="5,000.00"
              value={formik.values.contributionAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={handleErrorDisplay(formik, "contributionAmount")}
            />

            {/* Target Amount */}
            <Input
              label="Target Amount"
              name="targetAmount"
              placeholder="100,000.00"
              value={formik.values.targetAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={handleErrorDisplay(formik, "targetAmount")}
            />

            {/* Target Date */}
            <Input
              label="Target Date"
              name="targetDate"
              type="date"
              value={formik.values.targetDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={handleErrorDisplay(formik, "targetDate")}
            />

            <div className={styles.buttons}>
              <Button
                type="button"
                className={styles.backButton}
                onClick={handleClose}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                disabled={!formik.isValid || formik.isSubmitting}
                type="submit"
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </ModalShell>

      {/* ── Step 2: Confirmation ─────────────────────────── */}
      <ConfirmationDetailsModal
        isOpen={isOpen && step === "confirm"}
        accountType="Target Saver"
        values={{
          accountName: formik.values.accountName,
          initialDeposit: Number(formik.values.initialDeposit),
          contributionFrequency: formik.values.contributionFrequency,
          contributionAmount: Number(formik.values.contributionAmount),

          targetAmount: Number(formik.values.targetAmount),
          targetDate: formik.values.targetDate,
          description: formik.values.description,
        }}
        isSubmitting={formik.isSubmitting}
        onBack={handleBackToEdit}
        onClose={handleClose}
        onConfirm={formik.submitForm}
      />
    </>
  );
};

export default CreateTargetSaversModal;
