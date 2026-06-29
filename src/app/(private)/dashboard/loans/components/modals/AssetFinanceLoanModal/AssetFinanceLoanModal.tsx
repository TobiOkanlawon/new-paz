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
import TermsAndConditionModal from "../TermsAndConditionModal/TermsAndConditionModal";
import {
  applyForLoan,
  submitLoanPersonalInfo,
  submitLoanGuarantorDetails,
} from "@/actions/loans";
import styles from "./AssetFinanceLoanModal.module.css";
import Button from "@/components/Button";


const TABS = ["Loan Details", "Asset Type", "Personal Information", "Guarantor", "Documents"];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
  onMakePayment?: VoidFunction;
};

const initialValues = {
  loanAmount: "",
  loanTenure: "",
  loanPurpose: "",
  assetName: "",
  assetAmount: "",
  agreedToTerms: false,
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
    loanAmount: Yup.string().required("Loan amount is required"),
    loanTenure: Yup.string().required("Loan tenure is required"),
    loanPurpose: Yup.string().required("Purpose of loan is required"),
  }),
  Yup.object({
    assetName: Yup.string().required("Asset name is required"),
    assetAmount: Yup.string()
      .required("Asset amount is required")
      .matches(/^\d[\d,]*$/, "Enter a valid asset amount"),
    agreedToTerms: Yup.boolean().oneOf(
      [true],
      "You must agree to terms and conditions",
    ),
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

const parseAmount = (value: string): number => Number(value.replace(/,/g, ""));
const parseTenor = (value: string): string => value.replace(/\s*months?/i, "").trim();

const AssetFinanceLoanModal = ({ isOpen, onClose, onSubmit, onMakePayment }: Props) => {
  const [step, setStep] = useState(0);
  const [nextId, setNextId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

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
      // Step 0 — Loan Details
      if (step === 0) {
        const result = await applyForLoan({
          purpose: values.loanPurpose,
          amount: parseAmount(values.loanAmount),
          tenor: parseTenor(values.loanTenure),
          loanType: "ASSET_FINANCE_LOAN",
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

      // Step 1 — Asset Type (no API call, just advance)
      if (step === 1) {
        setStep(2);
        return;
      }

      // Step 2 — Personal Info
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

      // Step 3 — Guarantor
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

      // Step 4 (last) — Documents
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
    <>
      <Modal2 isOpen={isOpen} onClose={handleClose} width={647}>
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
                <h2 className={styles.title}>Asset Finance Loan</h2>
                <LoanTabs tabs={TABS} activeTab={step} />

                {step === 0 && (
                  <div className={styles.form}>
                    <LoanSelect
                      label="Loan Amount"
                      options={["2,000,000", "5,000,000"]}
                      value={values.loanAmount}
                      onChange={handleChange("loanAmount")}
                      onBlur={handleBlur("loanAmount")}
                      placeholder="Select a valid loan amount"
                      error={touched.loanAmount ? errors.loanAmount : undefined}
                    />
                    <LoanSelect
                      label="Loan Tenure"
                      options={["3 months", "6 months", "9 months", "12 months"]}
                      value={values.loanTenure}
                      onChange={handleChange("loanTenure")}
                      onBlur={handleBlur("loanTenure")}
                      placeholder="Select a loan tenure"
                      error={touched.loanTenure ? errors.loanTenure : undefined}
                    />
                    <LoanInput
                      label="Purpose of Loan"
                      placeholder="Asset Purchase"
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
                      label="Assets Name"
                      options={["Car", "Motorcycle", "Machinery", "Equipment"]}
                      value={values.assetName}
                      onChange={handleChange("assetName")}
                      onBlur={handleBlur("assetName")}
                      placeholder="Car"
                      error={touched.assetName ? errors.assetName : undefined}
                    />
                    <LoanInput
                      label="Asset Amount"
                      placeholder="2,000,000"
                      value={values.assetAmount}
                      onChange={handleChange("assetAmount")}
                      onBlur={handleBlur("assetAmount")}
                      error={touched.assetAmount ? errors.assetAmount : undefined}
                    />
                    <label className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={values.agreedToTerms}
                        onChange={handleChange("agreedToTerms")}
                        onBlur={handleBlur("agreedToTerms")}
                      />
                      <span className={styles.checkboxLabel}>
                        I agree to{" "}
                        <span className={styles.link} onClick={() => setTermsOpen(true)}>
                          terms and agreement of contract
                        </span>
                      </span>
                    </label>
                    {touched.agreedToTerms && errors.agreedToTerms && (
                      <div style={{ color: "red", fontSize: "12px", marginTop: "8px" }}>
                        {errors.agreedToTerms}
                      </div>
                    )}
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
                      Please upload the required documents to complete your loan application.
                      All documents should be clear and legible.
                    </p>
                    <DocumentUpload label="Identity Proof (National Identity Number)" />
                    <DocumentUpload label="Account Proof (Bank Statement)" />
                    <DocumentUpload label="Asset Proof (Invoice)" />
                    <div className={styles.docFooter}>
                      <Button variant="primary" onClick={onMakePayment}>
                        Make Payment
                      </Button>
                      <LoanFormFooter
                        onBack={back}
                        onContinue={() => handleNext(values, validateForm, setTouched)}
                        continueLabel="Submit Application"
                        loading={isLoading}
                        isSubmitButton={isLastStep}
                      />
                    </div>
                  </div>
                )}

                {step !== 4 && (
                  <LoanFormFooter
                    onBack={back}
                    onContinue={() => handleNext(values, validateForm, setTouched)}
                    continueLabel="Continue"
                    loading={isLoading}
                  />
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Modal2>

      <TermsAndConditionModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
      />
    </>
  );
};

export default AssetFinanceLoanModal;