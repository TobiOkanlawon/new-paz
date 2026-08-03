"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Button from "@/components/Button";
import LoanInput from "../../loans/components/shared/LoanInput";
import { handleErrorDisplay, formatBirthdayToBackendFormat } from "@/libs/helpers";
import { verifyBvnAction } from "@/app/(public)/kyc/actions";
import styles from "./AccountGate.module.css";

const schema = Yup.object({
  bvn: Yup.string()
    .required("BVN is required")
    .matches(/^\d{11}$/, "BVN must be exactly 11 digits"),
  dob: Yup.string().required("Date of birth is required"),
});

type Props = {
  onVerified: VoidFunction;
};

const BvnStep = ({ onVerified }: Props) => {
  const { update } = useSession();

  const formik = useFormik({
    initialValues: { bvn: "", dob: "" },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      const response = await verifyBvnAction({
        bvn: values.bvn,
        dob: formatBirthdayToBackendFormat(values.dob) || values.dob,
      });

      if (!response.success) {
        toast.error(response.message || "BVN verification failed. Please try again.");
        setSubmitting(false);
        return;
      }

      toast.success("BVN verified successfully");
      await update({ isBvnVerified: true });
      setSubmitting(false);
      onVerified();
    },
  });

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <div>
        <LoanInput
          label="BVN"
          name="bvn"
          inputMode="numeric"
          placeholder="12345678901"
          maxLength={11}
          value={formik.values.bvn}
          onBlur={formik.handleBlur}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 11);
            formik.setFieldValue("bvn", val);
          }}
          error={handleErrorDisplay(formik, "bvn")}
        />
        <span className={styles.charCount}>{formik.values.bvn.length}/11 digits</span>
      </div>

      <LoanInput
        label="Date of Birth"
        name="dob"
        type="date"
        value={formik.values.dob}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={handleErrorDisplay(formik, "dob")}
      />

      <div className={styles.footer}>
        <Button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
          loading={formik.isSubmitting}
        >
          Verify BVN
        </Button>
      </div>
    </form>
  );
};

export default BvnStep;
