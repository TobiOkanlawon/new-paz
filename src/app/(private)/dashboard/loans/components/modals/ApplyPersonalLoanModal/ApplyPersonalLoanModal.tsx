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
// Documents step disabled for now — not a step for personal loans currently.
// Don't delete, just commented out — see the "Documents" step below.
// import DocumentUpload from "../../shared/DocumentUpload";
import { usePersonalInfoPrefill } from "../../shared/usePersonalInfoPrefill";
import { PERSONAL_LOAN_PURPOSE_OPTIONS } from "../../shared/loanPurposeOptions";
import { useLoanResume } from "../../shared/useLoanResume";
import { formatAmountInput } from "../../shared/formatAmountInput";
import { buildTenureOptions, parseTenureDays } from "../../shared/loanTenure";
import {
  applyForLoan,
  submitLoanEmploymentDetails,
  submitLoanPersonalInfo,
  submitLoanGuarantorDetails,
  type LoanProduct,
} from "@/actions/loans";
// import { uploadLoanDocumentAction } from "@/actions/uploadLoanDocuments";
import styles from "./ApplyPersonalLoanModal.module.css";

const RESUME_STEP_MAP = { EMP: 1, IPE: 2, IGU: 3 };
const RESUME_FALLBACK_STEP = 1;

const TABS = [
  "Loan Details",
  "Employment",
  "Personal Information",
  "Guarantor",
  // "Documents", // disabled for now — not a step for personal loans currently
];

const FALLBACK_TENURE_OPTIONS = ["30 days", "60 days", "90 days"];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
  loanProduct?: LoanProduct;
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
    loanAmount: Yup.string()
      .required("Loan amount is required")
      .matches(/^\d[\d,]*$/, "Enter a valid loan amount"),
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

// Documents step disabled for now — not a step for personal loans currently.
// Don't delete, just commented out.
// const documentLabels = {
//   identityProof: "Identity Proof (National Identity Number)",
//   accountProof: "Account Proof (Bank Statement)",
// } as const;
//
// type DocumentKey = keyof typeof documentLabels;
// type DocumentState = { name: string; url: string | null; uploading: boolean };
// type LoanDocumentsState = Record<DocumentKey, DocumentState>;
// type LoanDocumentErrors = Record<DocumentKey, string>;
//
// const emptyDocumentState: DocumentState = { name: "", url: null, uploading: false };

const ApplyPersonalLoanModal = ({ isOpen, onClose, onSubmit, loanProduct }: Props) => {
  const [step, setStep] = useState(0);
  const [nextId, setNextId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const tenureOptions = buildTenureOptions(loanProduct?.tenor, FALLBACK_TENURE_OPTIONS);
  // Documents step disabled for now — not a step for personal loans currently.
  // const [documents, setDocuments] = useState<LoanDocumentsState>({
  //   identityProof: { ...emptyDocumentState },
  //   accountProof: { ...emptyDocumentState },
  // });
  // const [documentErrors, setDocumentErrors] = useState<LoanDocumentErrors>({
  //   identityProof: "",
  //   accountProof: "",
  // });

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
    // Documents step disabled for now — not a step for personal loans currently.
    // setDocuments({
    //   identityProof: { ...emptyDocumentState },
    //   accountProof: { ...emptyDocumentState },
    // });
    // setDocumentErrors({ identityProof: "", accountProof: "" });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Documents step disabled for now — not a step for personal loans currently.
  // Don't delete, just commented out.
  // const handleDocumentSelect = async (key: DocumentKey, file: File) => {
  //   if (!nextId) {
  //     setDocumentErrors((current) => ({
  //       ...current,
  //       [key]: "Session error. Please restart the application.",
  //     }));
  //     return;
  //   }
  //
  //   setDocumentErrors((current) => ({ ...current, [key]: "" }));
  //   setDocuments((current) => ({
  //     ...current,
  //     [key]: { name: file.name, url: null, uploading: true },
  //   }));
  //
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("loanType", "PERSONAL_LOAN");
  //   formData.append("nextId", nextId);
  //   formData.append("fieldName", key);
  //
  //   const result = await uploadLoanDocumentAction(formData);
  //
  //   if (!result.success) {
  //     setDocuments((current) => ({ ...current, [key]: { ...emptyDocumentState } }));
  //     setDocumentErrors((current) => ({
  //       ...current,
  //       [key]: result.error || "Upload failed. Please try again.",
  //     }));
  //     return;
  //   }
  //
  //   setDocuments((current) => ({
  //     ...current,
  //     [key]: { name: file.name, url: result.data.documentUrl, uploading: false },
  //   }));
  // };
  //
  // const validateDocuments = () => {
  //   const nextErrors: LoanDocumentErrors = {
  //     identityProof: documents.identityProof.url ? "" : `${documentLabels.identityProof} is required`,
  //     accountProof: documents.accountProof.url ? "" : `${documentLabels.accountProof} is required`,
  //   };
  //
  //   setDocumentErrors(nextErrors);
  //
  //   return Object.values(nextErrors).every((error) => error === "");
  // };

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
          tenor: parseTenureDays(values.loanTenure),
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

      // Step 3 (last, for now — Documents step disabled) — guarantor
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
        toast.success("Loan application submitted! You'll be notified once it's reviewed.");
        onSubmit?.();
        handleClose();
        return;
      }

      // Documents step disabled for now — not a step for personal loans currently.
      // Don't delete, just commented out. Guarantor (step 3) is the final step
      // above until this is re-enabled.
      // // Step 4 (last) — documents
      // if (step === 4) {
      //   if (!nextId) {
      //     toast.error("Session error. Please restart the application.");
      //     return;
      //   }
      //
      //   if (Object.values(documents).some((doc) => doc.uploading)) {
      //     toast.error("Please wait for document uploads to finish.");
      //     return;
      //   }
      //
      //   if (!validateDocuments()) {
      //     toast.error("Please upload the required documents before submitting.");
      //     return;
      //   }
      //
      //   toast.success("Loan application submitted! You'll be notified once it's reviewed.");
      //   onSubmit?.();
      //   handleClose();
      // }
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
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={stepSchemas[step]}
        validateOnChange={false}
        validateOnBlur
        onSubmit={() => {}}
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
                    options={PERSONAL_LOAN_PURPOSE_OPTIONS}
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
                    placeholder="Select an employemnt status"
                    error={touched.employmentStatus ? errors.employmentStatus : undefined}
                  />
                  <LoanInput
                    label="Monthly Income"
                    placeholder="Your Monthly Income"
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

              {/* Documents step disabled for now — not a step for personal loans
                  currently. Don't delete, just commented out.
              {step === 4 && (
                <div className={styles.form}>
                  <p className={styles.docNote}>
                    Please upload the required documents to complete your loan application. All documents should be clear and legible.
                  </p>
                  <DocumentUpload
                    label={documentLabels.identityProof}
                    fileName={documents.identityProof.name}
                    uploading={documents.identityProof.uploading}
                    uploaded={Boolean(documents.identityProof.url)}
                    onFileChange={(file, error) => {
                      if (error) {
                        setDocumentErrors((current) => ({ ...current, identityProof: error }));
                        return;
                      }

                      if (file) {
                        handleDocumentSelect("identityProof", file);
                      }
                    }}
                    error={documentErrors.identityProof}
                  />
                  <DocumentUpload
                    label={documentLabels.accountProof}
                    fileName={documents.accountProof.name}
                    uploading={documents.accountProof.uploading}
                    uploaded={Boolean(documents.accountProof.url)}
                    onFileChange={(file, error) => {
                      if (error) {
                        setDocumentErrors((current) => ({ ...current, accountProof: error }));
                        return;
                      }

                      if (file) {
                        handleDocumentSelect("accountProof", file);
                      }
                    }}
                    error={documentErrors.accountProof}
                  />
                </div>
              )}
              */}

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