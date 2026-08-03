"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Button from "@/components/Button";
import LoanInput from "../../loans/components/shared/LoanInput";
import { handleErrorDisplay } from "@/libs/helpers";
import { addAccount } from "@/actions/preAuth";
import styles from "./AccountGate.module.css";

const schema = Yup.object({
  accountNumber: Yup.string()
    .required("Account number is required")
    .length(10, "Account number must be 10 digits"),
  accountName: Yup.string().required("Account name is required"),
  bankName: Yup.string().required("Bank name is required"),
});

type Props = {
  onLinked: VoidFunction;
};

const AccountStep = ({ onLinked }: Props) => {
  const { update } = useSession();

  const formik = useFormik({
    initialValues: { accountNumber: "", accountName: "", bankName: "" },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      const response = await addAccount(
        values.accountName,
        values.accountNumber,
        values.bankName,
      );

      if (!response.success) {
        toast.error(response.error || "Failed to add account. Please try again.");
        setSubmitting(false);
        return;
      }

      toast.success("Bank account linked successfully");
      await update({ primaryAccountLinked: true });
      setSubmitting(false);
      onLinked();
    },
  });

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <div>
        <LoanInput
          label="Account Number"
          name="accountNumber"
          inputMode="numeric"
          placeholder="1234567890"
          maxLength={10}
          value={formik.values.accountNumber}
          onBlur={formik.handleBlur}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
            formik.setFieldValue("accountNumber", val);
          }}
          error={handleErrorDisplay(formik, "accountNumber")}
        />
        <span className={styles.charCount}>{formik.values.accountNumber.length}/10 digits</span>
      </div>

      <LoanInput
        label="Account Name"
        placeholder="Name on account"
        {...formik.getFieldProps("accountName")}
        error={handleErrorDisplay(formik, "accountName")}
      />

      <LoanInput
        label="Bank Name"
        placeholder="e.g. Kuda Bank"
        {...formik.getFieldProps("bankName")}
        error={handleErrorDisplay(formik, "bankName")}
      />

      <div className={styles.footer}>
        <Button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
          loading={formik.isSubmitting}
        >
          Add Account
        </Button>
      </div>
    </form>
  );
};

export default AccountStep;
