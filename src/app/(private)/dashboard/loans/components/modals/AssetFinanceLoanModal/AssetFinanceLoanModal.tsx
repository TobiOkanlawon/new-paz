import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Modal2 from "@/components/Modal2";
import LoanTabs from "../../shared/LoanTabs";
import LoanSelect from "../../shared/LoanSelect";
import LoanInput from "../../shared/LoanInput";
import LoanFormFooter from "../../shared/LoanFormFooter";
import DocumentUpload from "../../shared/DocumentUpload";
import { usePersonalInfoPrefill } from "../../shared/usePersonalInfoPrefill";
import { ASSET_FINANCE_PURPOSE_OPTIONS } from "../../shared/loanPurposeOptions";
import { useLoanResume } from "../../shared/useLoanResume";
import { formatAmountInput } from "../../shared/formatAmountInput";
import { buildTenureOptions, parseTenureDays } from "../../shared/loanTenure";
import TermsAndConditionModal from "../TermsAndConditionModal/TermsAndConditionModal";
import {
  applyForLoan,
  submitLoanPersonalInfo,
  submitLoanGuarantorDetails,
  submitLoanAssetDetails,
  submitAssetFinanceDocuments,
  type LoanProduct,
} from "@/actions/loans";
import { uploadLoanDocumentAction } from "@/actions/uploadLoanDocuments";
import styles from "./AssetFinanceLoanModal.module.css";
// "Make Payment" button disabled for now — see the docFooter block below.
// import Button from "@/components/Button";

const RESUME_STEP_MAP = { IPE: 2, IGU: 3 };
const RESUME_FALLBACK_STEP = 1;

const TABS = ["Loan Details", "Asset Type", "Personal Information", "Guarantor", "Documents"];

const FALLBACK_TENURE_OPTIONS = ["90 days", "180 days", "365 days"];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
  onMakePayment?: VoidFunction;
  loanProduct?: LoanProduct;
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
    loanAmount: Yup.string()
      .required("Loan amount is required")
      .matches(/^\d[\d,]*$/, "Enter a valid loan amount"),
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

const documentLabels = {
  identityProof: "Identity Proof (National Identity Number)",
  accountProof: "Account Proof (Bank Statement)",
  assetProof: "Asset Proof (Invoice)",
} as const;

type DocumentKey = keyof typeof documentLabels;
type DocumentState = { name: string; url: string | null; uploading: boolean };
type LoanDocumentsState = Record<DocumentKey, DocumentState>;
type LoanDocumentErrors = Record<DocumentKey, string>;

const emptyDocumentState: DocumentState = { name: "", url: null, uploading: false };

const AssetFinanceLoanModal = ({ isOpen, onClose, onSubmit, onMakePayment, loanProduct }: Props) => {
  const [step, setStep] = useState(0);
  const [nextId, setNextId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const tenureOptions = buildTenureOptions(loanProduct?.tenor, FALLBACK_TENURE_OPTIONS);
  const [termsOpen, setTermsOpen] = useState(false);
  const [documents, setDocuments] = useState<LoanDocumentsState>({
    identityProof: { ...emptyDocumentState },
    accountProof: { ...emptyDocumentState },
    assetProof: { ...emptyDocumentState },
  });
  const [documentErrors, setDocumentErrors] = useState<LoanDocumentErrors>({
    identityProof: "",
    accountProof: "",
    assetProof: "",
  });

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
    setDocuments({
      identityProof: { ...emptyDocumentState },
      accountProof: { ...emptyDocumentState },
      assetProof: { ...emptyDocumentState },
    });
    setDocumentErrors({ identityProof: "", accountProof: "", assetProof: "" });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleDocumentSelect = async (key: DocumentKey, file: File) => {
    if (!nextId) {
      setDocumentErrors((current) => ({
        ...current,
        [key]: "Session error. Please restart the application.",
      }));
      return;
    }

    setDocumentErrors((current) => ({ ...current, [key]: "" }));
    setDocuments((current) => ({
      ...current,
      [key]: { name: file.name, url: null, uploading: true },
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("loanType", "ASSET_FINANCE_LOAN");
    formData.append("nextId", nextId);
    formData.append("fieldName", key);

    const result = await uploadLoanDocumentAction(formData);

    if (!result.success) {
      setDocuments((current) => ({ ...current, [key]: { ...emptyDocumentState } }));
      setDocumentErrors((current) => ({
        ...current,
        [key]: result.error || "Upload failed. Please try again.",
      }));
      return;
    }

    setDocuments((current) => ({
      ...current,
      [key]: { name: file.name, url: result.data.documentUrl, uploading: false },
    }));
  };

  const validateDocuments = () => {
    const nextErrors: LoanDocumentErrors = {
      identityProof: documents.identityProof.url ? "" : `${documentLabels.identityProof} is required`,
      accountProof: documents.accountProof.url ? "" : `${documentLabels.accountProof} is required`,
      assetProof: documents.assetProof.url ? "" : `${documentLabels.assetProof} is required`,
    };

    setDocumentErrors(nextErrors);

    return Object.values(nextErrors).every((error) => error === "");
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
          tenor: parseTenureDays(values.loanTenure),
          loanType: "ASSET_FINANCE",
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

      // Step 1 — Asset Type
      if (step === 1) {
        if (!nextId) {
          toast.error("Session error. Please restart the application.");
          return;
        }

        const result = await submitLoanAssetDetails({
          assetName: values.assetName,
          assetAmount: parseAmount(values.assetAmount),
          nextId,
        });

        if (!result.success) {
          toast.error(result.error || "Failed to submit asset details. Please try again.");
          return;
        }

        setNextId(result.data.nextId);
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
        if (!nextId) {
          toast.error("Session error. Please restart the application.");
          return;
        }

        if (Object.values(documents).some((doc) => doc.uploading)) {
          toast.error("Please wait for document uploads to finish.");
          return;
        }

        if (!validateDocuments()) {
          toast.error("Please upload the required documents before submitting.");
          return;
        }

        const result = await submitAssetFinanceDocuments({
          identityProof: documents.identityProof.url as string,
          bankStatement: documents.accountProof.url as string,
          invoice: documents.assetProof.url as string,
          nextId,
        });

        if (!result.success) {
          toast.error(result.error || "Failed to submit documents. Please try again.");
          return;
        }

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
      <Modal2 isOpen={isOpen} onClose={handleClose} width={647} title="Asset Finance Loan">
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
                    <LoanSelect
                      label="Loan Tenure"
                      options={tenureOptions}
                      value={values.loanTenure}
                      onChange={handleChange("loanTenure")}
                      onBlur={handleBlur("loanTenure")}
                      placeholder="Select a loan tenure"
                      error={touched.loanTenure ? errors.loanTenure : undefined}
                    />
                    <LoanSelect
                      label="Purpose of Loan"
                      options={ASSET_FINANCE_PURPOSE_OPTIONS}
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
                      label="Assets Name"
                      options={["Car", "Motorcycle", "Machinery", "Equipment"]}
                      value={values.assetName}
                      onChange={handleChange("assetName")}
                      onBlur={handleBlur("assetName")}
                      placeholder="Put in Asset Name"
                      error={touched.assetName ? errors.assetName : undefined}
                    />
                    <LoanInput
                      label="Asset Amount"
                      placeholder="Put in Asset Amount"
                      inputMode="numeric"
                      value={values.assetAmount}
                      onChange={(e) =>
                        setFieldValue("assetAmount", formatAmountInput(e.target.value))
                      }
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
                      placeholder="Enter BVN Number"
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
                      placeholder="Guarantor Phone Number"
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
                    <DocumentUpload
                      label={documentLabels.assetProof}
                      fileName={documents.assetProof.name}
                      uploading={documents.assetProof.uploading}
                      uploaded={Boolean(documents.assetProof.url)}
                      onFileChange={(file, error) => {
                        if (error) {
                          setDocumentErrors((current) => ({ ...current, assetProof: error }));
                          return;
                        }

                        if (file) {
                          handleDocumentSelect("assetProof", file);
                        }
                      }}
                      error={documentErrors.assetProof}
                    />
                    <div className={styles.docFooter}>
                      {/* "Make Payment" disabled for now — doesn't belong on an
                          unsubmitted, not-yet-approved application. Don't delete,
                          just commented out; belongs on an active loan's
                          repayment flow instead (see RepayLoanModal).
                      <Button variant="primary" onClick={onMakePayment}>
                        Make Payment
                      </Button>
                      */}
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