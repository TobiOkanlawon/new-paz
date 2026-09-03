import styles from "../kycverification.module.css";
import * as yup from "yup";
import Input from "@/components/Input";
import { handleErrorDisplay, calculateAge } from "@/libs/helpers";
import { useFormik } from "formik";
import { verifyBvnAction } from "@/app/(public)/kyc/actions";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import { signOut, useSession } from "next-auth/react";

const schema = yup.object({
  bvn: yup
    .string()
    .required("BVN is required")
    .matches(/^\d{11}$/, "BVN must be exactly 11 digits"),

  dob: yup
    .string()
    .required("Date of birth is required")
    .test(
      "is-18-or-older",
      "You must be 18 years or older",
      (value) => {
        const age = calculateAge(value);
        return age !== null && age >= 18;
      },
    ),
});

const EnterStep = ({
  onVerify,
  onBack,
}: {
  onVerify: () => void;
  onBack: () => void;
}) => {
  const { update } = useSession();

  const formik = useFormik({
    initialValues: {
      bvn: "",
      dob: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      const response = await verifyBvnAction(values);

      if (!response.success) {
        toast.error(response.message);
        setSubmitting(false);
        return;
      }

      update({
        isBvnVerified: true,
      });

      onVerify();
    },
  });

  return (
    <div className={styles.stepContent}>
      <div className={styles.header}>
        <h1 className={styles.title}>Enter BVN</h1>
        <p className={styles.subtitle}>
          Please enter your 11-digits Bank Verification Number
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className={styles.inputGroup}>
          <Input
            type="text"
            label="BVN"
            inputMode="numeric"
            placeholder="12345678901"
            maxLength={11}
            {...formik.getFieldProps("bvn")}
            errors={handleErrorDisplay(formik, "bvn")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 11);
              formik.setFieldValue("bvn", val);
            }}
          />
          <span
            className={`${styles.charCount} ${
              formik.values.bvn.length === 11 ? styles.charCountFull : ""
            }`}
          >
            {formik.values.bvn.length}/11 digits
          </span>
        </div>

        <div className={styles.inputGroup}>
          <Input
            type="date"
            label="Date of Birth"
            {...formik.getFieldProps("dob")}
            onChange={(e) => {
              formik.handleChange(e);

              const age = calculateAge(e.target.value);
              if (age !== null && age < 18) {
                toast.error(
                  "You must be 18 years or older to use this service.",
                  { toastId: "under-age" },
                );
              }
            }}
            errors={handleErrorDisplay(formik, "dob")}
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
          <Button
            type="submit"
            className={`${styles.primaryBtn} ${styles.verifyBtn}`}
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
            loading={formik.isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnterStep;
