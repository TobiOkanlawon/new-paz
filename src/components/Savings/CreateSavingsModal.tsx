"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import ModalShell from "@/components/ModalShell/ModalShell";
import Input from "@/components/Input";
import Button from "@/components/Button";
import styles from "./createSavingsAccountModal.module.css";
import { handleErrorDisplay } from "@/libs/helpers";
import ConfirmationDetailsModal from "./ConfirmDetailsModal";
import { toast } from "react-toastify";
import { ActionResult } from "@/actions/shared";

interface SubmitValues {
  accountName: string;
  description: string;
  // initialDeposit: number;
  // contributionFrequency: string;
  // contributionAmount: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SubmitValues) => Promise<ActionResult<any>>;
}

const validationSchema = yup.object({
  accountName: yup.string().required("Account name is required"),
  description: yup.string().required("Description is required"),
  // initialDeposit: yup
  //   .number()
  //   .typeError("Enter a valid amount")
  //   .required("Initial deposit is required")
  //   .min(1000, "Minimum deposit is 1,000"),
  // contributionFrequency: yup.string().required("Select a frequency"),
  // contributionAmount: yup
  //   .number()
  //   .typeError("Enter a valid amount")
  //   .required("Contribution amount is required")
  //   .min(500, "Minimum contribution is 500"),
});

const CreateSoloSaversModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // Controls which step is visible: "form" | "confirm"
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<SubmitValues>({
    initialValues: {
      accountName: "",
      description: "",
      // initialDeposit: "",
      // contributionFrequency: "Monthly",
      // contributionAmount: "",
    },
    validationSchema,
    // "Continue" validates the form then advances to the confirmation screen
    onSubmit: () => {
      setStep("confirm");
    },
  });

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        accountName: formik.values.accountName,
        description: formik.values.description,
        // initialDeposit: Number(formik.values.initialDeposit),
        // contributionFrequency: formik.values.contributionFrequency,
        // contributionAmount: Number(formik.values.contributionAmount),
      });
      toast.success("Savings plan created successfully");
      // Reset everything on success
      formik.resetForm();
      setStep("form");
      onClose();
    } catch (e) {
      toast.error("An error occured while trying to create savings plan");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        title="Create Solo Saver Plan"
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
              placeholder="Valentine Savings"
              value={formik.values.accountName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={handleErrorDisplay(formik, "accountName")}
            />
            <Input
              label="Description"
              placeholder="I want to take my partner out for Valentine's day"
              {...formik.getFieldProps("description")}
              errors={handleErrorDisplay(formik, "accountName")}
            />

            {/*<Input
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
              />*/}
            <div className={styles.buttons}>
              <Button
                type="button"
                className={styles.backButton}
                onClick={handleClose}
                variant="outlined"
              >
                Back
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </div>
      </ModalShell>

      {/* ── Step 2: Confirmation ─────────────────────────── */}
      <ConfirmationDetailsModal
        isOpen={isOpen && step === "confirm"}
        accountType="Solo Saver"
        values={{
          accountName: formik.values.accountName,
          /* initialDeposit: Number(formik.values.initialDeposit),
          contributionFrequency: formik.values.contributionFrequency,
          contributionAmount: Number(formik.values.contributionAmount), */
        }}
        isSubmitting={isSubmitting}
        onBack={handleBackToEdit}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default CreateSoloSaversModal;
