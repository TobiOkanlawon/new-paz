import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Modal2 from "@/components/Modal2";
import LoanTabs from "../../shared/LoanTabs";
import LoanSelect from "../../shared/LoanSelect";
import LoanInput from "../../shared/LoanInput";
import LoanFormFooter from "../../shared/LoanFormFooter";
import DocumentUpload from "../../shared/DocumentUpload";
import {
  applyForLoan,
  submitLoanEmploymentDetails,
  submitLoanPersonalInfo,
  submitLoanGuarantorDetails,
} from "@/actions/loans";
import styles from "./ApplyPersonalLoanModal.module.css";

const TABS = [
  "Loan Details",
  "Employment",
  "Personal Information",
  "Guarantor",
  "Documents",
];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
};

const initialValues = {
  loanType: "Business Loan",
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
  guarantorName: "",
  guarantorPhone: "",
};

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
    fullName: Yup.string().required("Full name is required").min(2),
    email: Yup.string().required("Email is required").email(),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^0\d{10}$/, "Enter a valid 11-digit Nigerian phone number"),
    dob: Yup.string().required("Date of birth is required"),
    bvn: Yup.string().required("BVN is required").matches(/^\d{11}$/),
  }),
  Yup.object({
    guarantorName: Yup.string().required("Guarantor name is required"),
    guarantorPhone: Yup.string()
      .required("Guarantor phone is required")
      .matches(/^0\d{10}$/, "Enter a valid 11-digit Nigerian phone number"),
  }),
  Yup.object(),
];

const parseIncome = (value: string): number => Number(value.replace(/,/g, ""));
const parseTenor = (value: string): string => value.replace(/\s*days?/i, "").trim();

const ApplyPersonalLoanModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [step, setStep] = useState(0);
  const [nextId, setNextId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLastStep = step === TABS.length - 1;

  const resetModal = () => {
    setStep(0);
    setNextId(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleNext = async (
    values: typeof initialValues,
    validateForm: () => Promise<Record<string, string>>,
    setTouched: (fields: Record<string, boolean>) => void,
  ) => {
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      const stepFields = Object.keys(stepSchemas[step].fields);
      setTouched(Object.fromEntries(stepFields.map((f) => [f, true])));
      return;
    }

    setIsLoading(true);

    try {
      // Step 0 — initialize loan application
      if (step === 0) {
        const result = await applyForLoan({
          purpose: values.loanPurpose,
          amount: parseIncome(values.loanAmount),
          tenor: parseTenor(values.loanTenure),
          loanType: "PERSONAL_LOAN",
        });

        if (!result.success) {
          toast.error("Failed to initialize loan. Please try again.");
          return;
        }

        toast.success("Loan initialized successfully");
        setNextId(result.data.nextId);
        setStep(1);
        return;
      }

      // Step 1 — employment
      if (step === 1) {
        if (!nextId) {
          toast.error("Session error. Please restart the application.");
          return;
        }

        const result = await submitLoanEmploymentDetails({
          monthlyIncome: parseIncome(values.monthlyIncome),
          employmentStatus: values.employmentStatus.toLowerCase(),
          nextId,
        });

        if (!result.success) {
          toast.error("Failed to submit employment details. Please try again.");
          return;
        }

        setNextId(result.data.nextId);
        setStep(2);
        return;
      }

      // Step 2 — personal info
      if (step === 2) {
        if (!nextId) {
          toast.error("Session error. Please restart the application.");
          return;
        }

        const result = await submitLoanPersonalInfo({
          fullName: values.fullName,
          emailAddress: values.email,
          phoneNumber: values.phone,
          dateOfBirth: values.dob,
          BVN: values.bvn,
          nextId,
        });

        if (!result.success) {
          toast.error("Failed to submit personal information. Please try again.");
          return;
        }

        setNextId(result.data.nextId);
        setStep(3);
        return;
      }

      // Step 3 — guarantor
      if (step === 3) {
        if (!nextId) {
          toast.error("Session error. Please restart the application.");
          return;
        }

        const result = await submitLoanGuarantorDetails({
          name: values.guarantorName,
          phoneNumber: values.guarantorPhone,
          nextId,
        });

        if (!result.success) {
          toast.error("Failed to submit guarantor details. Please try again.");
          return;
        }

        setNextId(result.data.nextId);
        setStep(4);
        return;
      }

      // Step 4 (last) — documents
      if (step === 4) {
        toast.success("Loan application submitted! You'll be notified once it's reviewed.");
        onSubmit?.();
        handleClose();
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Modal2 isOpen={isOpen} onClose={handleClose} width={647} title="Apply For Personal Loan">
      <Formik
        initialValues={initialValues}
        validationSchema={stepSchemas[step]}
        validateOnChange={false}
        validateOnBlur
        onSubmit={() => {}}
      >
        {({ values, errors, touched, handleChange, handleBlur, validateForm, setTouched }) => (
          <Form>
            <div className={styles.container}>
              <LoanTabs tabs={TABS} activeTab={step} />

              {step === 0 && (
                <div className={styles.form}>
                  <LoanSelect
                    label="Loan Amount"
                    options={["250,000", "500,000", "1,000,000"]}
                    value={values.loanAmount}
                    onChange={handleChange("loanAmount")}
                    onBlur={handleBlur("loanAmount")}
                    placeholder="Select an amount"
                    error={touched.loanAmount ? errors.loanAmount : undefined}
                  />
                  <LoanSelect
                    label="Loan Tenure"
                    options={["30 days", "60 days", "90 days"]}
                    value={values.loanTenure}
                    onChange={handleChange("loanTenure")}
                    onBlur={handleBlur("loanTenure")}
                    placeholder="Select a loan tenure"
                    error={touched.loanTenure ? errors.loanTenure : undefined}
                  />
                  <LoanInput
                    label="Purpose of Loan"
                    placeholder="Working capital"
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
                    placeholder="Select an employemnt status"
                    error={touched.employmentStatus ? errors.employmentStatus : undefined}
                  />
                  <LoanInput
                    label="Monthly Income"
                    placeholder="500,000"
                    value={values.monthlyIncome}
                    onChange={handleChange("monthlyIncome")}
                    onBlur={handleBlur("monthlyIncome")}
                    error={touched.monthlyIncome ? errors.monthlyIncome : undefined}
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

              {step === 3 && (
                <div className={styles.form}>
                  <LoanInput
                    label="Name"
                    placeholder="Guarantor Name"
                    value={values.guarantorName}
                    onChange={handleChange("guarantorName")}
                    onBlur={handleBlur("guarantorName")}
                    error={touched.guarantorName ? errors.guarantorName : undefined}
                  />
                  <LoanInput
                    label="Phone Number"
                    placeholder="08099631681"
                    value={values.guarantorPhone}
                    onChange={handleChange("guarantorPhone")}
                    onBlur={handleBlur("guarantorPhone")}
                    error={touched.guarantorPhone ? errors.guarantorPhone : undefined}
                  />
                </div>
              )}

              {step === 4 && (
                <div className={styles.form}>
                  <p className={styles.docNote}>
                    Please upload the required documents to complete your loan application. All documents should be clear and legible.
                  </p>
                  <DocumentUpload label="Identity Proof (National Identity Number)" />
                  <DocumentUpload label="Account Proof (Bank Statement)" />
                </div>
              )}

              <LoanFormFooter
                onBack={back}
                onContinue={() => handleNext(values, validateForm, setTouched)}
                continueLabel={isLastStep ? "Submit Application" : "Continue"}
                loading={isLoading}
                isSubmitButton={isLastStep}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal2>
  );
};

export default ApplyPersonalLoanModal;