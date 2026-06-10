import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal2 from "@/components/Modal2";
import LoanTabs from "../../shared/LoanTabs";
import LoanSelect from "../../shared/LoanSelect";
import LoanInput from "../../shared/LoanInput";
import LoanFormFooter from "../../shared/LoanFormFooter";
import styles from "./ApplyQuickLoanModal.module.css";

const TABS = ["Loan Details", "Employment", "Personal Information"];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
};

const initialValues = {
  loanType: "Quick Loan",
  loanAmount: "",
  loanTenure: "",
  loanPurpose: "",
  employmentStatus: "",
  monthlyIncome: "",
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  bvn: "",
};

// Per-step schemas — Formik will only validate the active step's fields
const stepSchemas = [
  Yup.object({
    loanType: Yup.string().required("Loan type is required"),
    loanAmount: Yup.string().required("Loan amount is required"),
    loanTenure: Yup.string().required("Loan tenure is required"),
    loanPurpose: Yup.string().required("Purpose of loan is required"),
  }),
  Yup.object({
    employmentStatus: Yup.string().required("Employment status is required"),
    monthlyIncome: Yup.string()
      .required("Monthly income is required")
      .matches(/^\d[\d,]*$/, "Enter a valid income amount"),
  }),
  Yup.object({
    fullName: Yup.string()
      .required("Full name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email address"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^0\d{10}$/, "Enter a valid 11-digit Nigerian phone number"),
    dob: Yup.string().required("Date of birth is required"),
    bvn: Yup.string()
      .required("BVN is required")
      .matches(/^\d{11}$/, "BVN must be exactly 11 digits"),
  }),
];

const ApplyQuickLoanModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [step, setStep] = useState(0);

  const isLastStep = step === TABS.length - 1;

  const handleNext = async (
    validateForm: () => Promise<Record<string, string>>,
    setTouched: (fields: Record<string, boolean>) => void,
  ) => {
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      // Touch all fields in the current step to surface errors
      const stepFields = Object.keys(stepSchemas[step].fields);
      setTouched(Object.fromEntries(stepFields.map((f) => [f, true])));
      return;
    }
    setStep((s) => Math.min(s + 1, TABS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Modal2
      isOpen={isOpen}
      onClose={onClose}
      width={627}
      title="Apply For Quick Loan"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={stepSchemas[step]}
        validateOnChange={false}
        validateOnBlur
        onSubmit={(values, { setSubmitting }) => {
          onSubmit?.();
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          validateForm,
          setTouched,
          isSubmitting,
        }) => (
          <Form>
            <div className={styles.container}>
              <LoanTabs tabs={TABS} activeTab={step} />

              {step === 0 && (
                <div className={styles.form}>
                  <LoanSelect
                    label="Loan Type"
                    options={["Quick Loan"]}
                    value={values.loanType}
                    onChange={handleChange("loanType")}
                    onBlur={handleBlur("loanType")}
                    error={touched.loanType ? errors.loanType : undefined}
                  />
                  <LoanSelect
                    label="Loan Amount"
                    options={["20,000", "50,000", "100,000"]}
                    value={values.loanAmount}
                    onChange={handleChange("loanAmount")}
                    onBlur={handleBlur("loanAmount")}
                    placeholder="20,000"
                    error={touched.loanAmount ? errors.loanAmount : undefined}
                  />
                  <LoanSelect
                    label="Loan Tenure"
                    options={["30 days", "60 days", "90 days"]}
                    value={values.loanTenure}
                    onChange={handleChange("loanTenure")}
                    onBlur={handleBlur("loanTenure")}
                    placeholder="30 days"
                    error={touched.loanTenure ? errors.loanTenure : undefined}
                  />
                  <LoanInput
                    label="Purpose of Loan"
                    placeholder="Wig"
                    value={values.loanPurpose}
                    onChange={handleChange("loanPurpose")}
                    onBlur={handleBlur("loanPurpose")}
                    error={touched.loanPurpose ? errors.loanPurpose : undefined}
                  />
                </div>
              )}

              {step === 1 && (
                <div className={styles.form}>
                  <LoanSelect
                    label="Employment Status"
                    options={["Employed", "Self-employed", "Unemployed"]}
                    value={values.employmentStatus}
                    onChange={handleChange("employmentStatus")}
                    onBlur={handleBlur("employmentStatus")}
                    placeholder="Employed"
                    error={
                      touched.employmentStatus
                        ? errors.employmentStatus
                        : undefined
                    }
                  />
                  <LoanInput
                    label="Monthly Income"
                    placeholder="500,000"
                    value={values.monthlyIncome}
                    onChange={handleChange("monthlyIncome")}
                    onBlur={handleBlur("monthlyIncome")}
                    error={
                      touched.monthlyIncome ? errors.monthlyIncome : undefined
                    }
                  />
                </div>
              )}

              {step === 2 && (
                <div className={styles.form}>
                  <LoanInput
                    label="Full Name"
                    placeholder="Esther Williams"
                    value={values.fullName}
                    onChange={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    error={touched.fullName ? errors.fullName : undefined}
                  />
                  <LoanInput
                    label="Email Address"
                    placeholder="Estherwilliams22@gmail.com"
                    type="email"
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email ? errors.email : undefined}
                  />
                  <LoanInput
                    label="Phone Number"
                    placeholder="08099631681"
                    value={values.phone}
                    onChange={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    error={touched.phone ? errors.phone : undefined}
                  />
                  <LoanInput
                    label="Date of Birth"
                    placeholder="MM/DD/YY"
                    type="date"
                    value={values.dob}
                    onChange={handleChange("dob")}
                    onBlur={handleBlur("dob")}
                    error={touched.dob ? errors.dob : undefined}
                  />
                  <LoanInput
                    label="BVN Number"
                    placeholder="Enter Number"
                    value={values.bvn}
                    onChange={handleChange("bvn")}
                    onBlur={handleBlur("bvn")}
                    error={touched.bvn ? errors.bvn : undefined}
                  />
                </div>
              )}

              <LoanFormFooter
                onBack={back}
                onContinue={
                  isLastStep
                    ? undefined // let the Form's submit handle it
                    : () => handleNext(validateForm, setTouched)
                }
                continueLabel={isLastStep ? "Submit" : "Continue"}
                isSubmitting={isSubmitting}
                isSubmitButton={isLastStep}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal2>
  );
};

export default ApplyQuickLoanModal;
