import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Modal2 from "@/components/Modal2";
import LoanTabs from "../../shared/LoanTabs";
import LoanSelect from "../../shared/LoanSelect";
import LoanInput from "../../shared/LoanInput";
import LoanTenureField from "../../shared/LoanTenureField";
import LoanFormFooter from "../../shared/LoanFormFooter";
import { usePersonalInfoPrefill } from "../../shared/usePersonalInfoPrefill";
import { QUICK_LOAN_PURPOSE_OPTIONS } from "../../shared/loanPurposeOptions";
import { useLoanResume } from "../../shared/useLoanResume";
import { formatAmountInput } from "../../shared/formatAmountInput";
import { buildTenureOptions, parseTenureDays } from "../../shared/loanTenure";
import {
  applyForLoan,
  submitLoanEmploymentDetails,
  submitLoanPersonalInfo,
  type LoanProduct,
} from "@/actions/loans";
import styles from "./ApplyQuickLoanModal.module.css";
import Input from "@/components/Input";

const RESUME_STEP_MAP = { EMP: 1, IPE: 2 };
const RESUME_FALLBACK_STEP = 1;

const TABS = ["Loan Details", "Employment", "Personal Information"];

const FALLBACK_TENURE_OPTIONS = ["30 days", "60 days", "90 days"];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
  loanProduct?: LoanProduct;
};

const initialValues = {
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

const stepSchemas = [
  Yup.object({
    loanAmount: Yup.string()
      .required("Loan amount is required")
      .matches(/^\d[\d,]*$/, "Enter a valid loan amount")
      .test(
        "range",
        "Loan amount must be between 1,000 and 100,000",
        (value) => {
          if (!value) return false;
          const amount = Number(value.replace(/,/g, ""));
          return amount >= 1000 && amount <= 100000;
        },
      ),
    loanTenure: Yup.string().required("Loan tenure is required"),
    loanPurpose: Yup.string().required("Purpose of loan is required"),
  }),
  Yup.object({
    employmentStatus: Yup.string().required("Employment status is required"),
    monthlyIncome: Yup.number()
      .positive()
      .required("Monthly income is required"),
    //.matches(/^\d[\d,]*$/, "Enter a valid income amount"),
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

// Strips commas from income strings like "200,000" before sending to the API
const parseIncome = (value: string): number => Number(value.replace(/,/g, ""));

const ApplyQuickLoanModal = ({ isOpen, onClose, onSubmit, loanProduct }: Props) => {
  const [step, setStep] = useState(0);
  const tenureOptions = buildTenureOptions(loanProduct?.tenor, FALLBACK_TENURE_OPTIONS);
  // nextId is threaded through each API step — not owned by Formik
  const [nextId, setNextId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formikRef = useRef<FormikProps<typeof initialValues>>(null);
  const prefill = usePersonalInfoPrefill(isOpen);
  const resume = useLoanResume(isOpen, RESUME_STEP_MAP, RESUME_FALLBACK_STEP);

  useEffect(() => {
    if (!prefill || !formikRef.current) return;

    const { values, setFieldValue } = formikRef.current;

    if (!values.fullName && prefill.fullName) setFieldValue("fullName", prefill.fullName);
    if (!values.email && prefill.email) setFieldValue("email", prefill.email);
    if (!values.phone && prefill.phone) setFieldValue("phone", prefill.phone);
    if (!values.dob && prefill.dob) setFieldValue("dob", prefill.dob);
  }, [prefill]);

  useEffect(() => {
    if (!resume) return;
    setNextId(resume.nextId);
    setStep(resume.step);
    toast.info("Resuming your previous loan application.");
  }, [resume]);

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

  // Validates the current step's fields, then runs the corresponding API call.
  // On success it advances the step and stores the returned nextId.
  // On the final step it calls onSubmit and closes the modal.
  const handleNext = async (
    values: typeof initialValues,
    validateForm: () => Promise<Record<string, string>>,
    setTouched: (fields: Record<string, boolean>) => void,
  ) => {
    // 1. Validate current step
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      const stepFields = Object.keys(stepSchemas[step].fields);
      setTouched(Object.fromEntries(stepFields.map((f) => [f, true])));
      return;
    }

    setIsLoading(true);

    try {
      // Step 0 — Loan Details → POST /v1/loan/request/apply
      if (step === 0) {
        const result = await applyForLoan({
          purpose: values.loanPurpose,
          amount: parseIncome(values.loanAmount),
          tenor: parseTenureDays(values.loanTenure),
          loanType: "QUICK_LOAN",
        });

        if (!result.success) {
          toast.error("Failed to submit loan details. Please try again.");
          return;
        }

        toast.success("Loan initialized successfully");
        setNextId(result.data.nextId);
        setStep(1);
        return;
      }

      // Step 1 — Employment → POST /v1/loan/request/update (EMP- nextId)
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

      // Step 2 (last) — Personal Info → POST /v1/loan/request/update (IPE- nextId)
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
          toast.error(
            "Failed to submit personal information. Please try again.",
          );
          return;
        }

        toast.success(
          "Loan application submitted! You'll be notified once it's reviewed.",
        );
        onSubmit?.();
        handleClose();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Modal2
      isOpen={isOpen}
      onClose={handleClose}
      width={627}
      title="Apply For Quick Loan"
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={stepSchemas[step]}
        validateOnChange={false}
        validateOnBlur
        onSubmit={() => {
          // Final submission is handled inside handleNext above.
          // Formik's onSubmit is intentionally left empty.
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
          setFieldValue,
        }) => (
          <Form>
            <div className={styles.container}>
              <LoanTabs tabs={TABS} activeTab={step} />

              {step === 0 && (
                <div className={styles.form}>
                  <LoanInput
                    label="Loan Amount"
                    placeholder="Enter loan amount"
                    inputMode="numeric"
                    value={values.loanAmount}
                    onChange={(e) =>
                      setFieldValue("loanAmount", formatAmountInput(e.target.value))
                    }
                    onBlur={handleBlur("loanAmount")}
                    error={touched.loanAmount ? errors.loanAmount : undefined}
                  />
                  <LoanTenureField
                    options={tenureOptions}
                    maxTenorDays={loanProduct?.tenor}
                    value={values.loanTenure}
                    onChange={(v) => setFieldValue("loanTenure", v)}
                    onBlur={handleBlur("loanTenure")}
                    error={touched.loanTenure ? errors.loanTenure : undefined}
                  />
                  <LoanSelect
                    label="Purpose of Loan"
                    options={QUICK_LOAN_PURPOSE_OPTIONS}
                    value={values.loanPurpose}
                    onChange={handleChange("loanPurpose")}
                    onBlur={handleBlur("loanPurpose")}
                    placeholder="Select a purpose"
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
                    placeholder="Selct your employment status"
                    error={
                      touched.employmentStatus
                        ? errors.employmentStatus
                        : undefined
                    }
                  />
                  <Input
                    label="Monthly Income"
                    placeholder="Enter Monthly Income"
                    value={values.monthlyIncome}
                    onChange={handleChange("monthlyIncome")}
                    onBlur={handleBlur("monthlyIncome")}
                    name="monthlyIncome"
                    errors={
                      touched.monthlyIncome ? errors.monthlyIncome : undefined
                    }
                  />
                </div>
              )}

              {step === 2 && (
                <div className={styles.form}>
                  <LoanInput
                    label="Full Name"
                    placeholder="Jane Doe"
                    value={values.fullName}
                    onChange={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    error={touched.fullName ? errors.fullName : undefined}
                  />
                  <LoanInput
                    label="Email Address"
                    placeholder="email@domain.com"
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
                onContinue={() => handleNext(values, validateForm, setTouched)}
                continueLabel={isLastStep ? "Submit" : "Continue"}
                loading={isLoading}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal2>
  );
};

export default ApplyQuickLoanModal;
