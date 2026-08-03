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
import { LPO_LOAN_PURPOSE_OPTIONS } from "../../shared/loanPurposeOptions";
import { useLoanResume } from "../../shared/useLoanResume";
import { usePersonalInfoPrefill } from "../../shared/usePersonalInfoPrefill";
import { formatAmountInput } from "../../shared/formatAmountInput";
import { buildTenureOptions, parseTenureDays } from "../../shared/loanTenure";
import {
  applyForLoan,
  submitLoanPersonalInfo,
  submitLoanCompanyDetails,
  type LoanProduct,
} from "@/actions/loans";
import { uploadLoanDocumentAction } from "@/actions/uploadLoanDocuments";
import styles from "./LocalPurchaseOrderModal.module.css";

const RESUME_STEP_MAP = { IPE: 1 };
const RESUME_FALLBACK_STEP = 1;

const TABS = ["Loan Details", "Director's Information", "Company's Information", "Documents"];

const FALLBACK_TENURE_OPTIONS = ["30 days", "90 days", "180 days"];

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
  directorName: "",
  directorEmail: "",
  directorPhone: "",
  directorDob: "",
  directorBvn: "",
  businessName: "",
  businessEmail: "",
  businessPhone: "",
  cacNumber: "",
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
    directorName: Yup.string().required("Director's name is required").min(2),
    directorEmail: Yup.string().required("Email is required").email(),
    directorPhone: Yup.string()
      .required("Phone number is required")
      .matches(/^0\d{10}$/, "Enter a valid 11-digit Nigerian phone number"),
    directorDob: Yup.string().required("Date of birth is required"),
    directorBvn: Yup.string().required("BVN is required").matches(/^\d{11}$/),
  }),
  Yup.object({
    businessName: Yup.string().required("Business name is required"),
    businessEmail: Yup.string().required("Email is required").email(),
    businessPhone: Yup.string()
      .required("Phone number is required")
      .matches(/^0\d{10}$/, "Enter a valid 11-digit Nigerian phone number"),
    cacNumber: Yup.string().required("CAC number is required"),
  }),
  Yup.object(),
];

const parseAmount = (value: string): number => Number(value.replace(/,/g, ""));

const documentLabels = {
  lpoProof: "LPO Proof (Local Purchase Order)",
  addressProof: "Address Proof (Bank Statement)",
} as const;

type DocumentKey = keyof typeof documentLabels;
type DocumentState = { name: string; url: string | null; uploading: boolean };
type LoanDocumentsState = Record<DocumentKey, DocumentState>;
type LoanDocumentErrors = Record<DocumentKey, string>;

const emptyDocumentState: DocumentState = { name: "", url: null, uploading: false };

const LocalPurchaseOrderModal = ({ isOpen, onClose, onSubmit, loanProduct }: Props) => {
  const [step, setStep] = useState(0);
  const [nextId, setNextId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const tenureOptions = buildTenureOptions(loanProduct?.tenor, FALLBACK_TENURE_OPTIONS);
  const [documents, setDocuments] = useState<LoanDocumentsState>({
    lpoProof: { ...emptyDocumentState },
    addressProof: { ...emptyDocumentState },
  });
  const [documentErrors, setDocumentErrors] = useState<LoanDocumentErrors>({
    lpoProof: "",
    addressProof: "",
  });

  const isLastStep = step === TABS.length - 1;
  const formikRef = useRef<FormikProps<typeof initialValues>>(null);
  const prefill = usePersonalInfoPrefill(isOpen);
  const resume = useLoanResume(isOpen, RESUME_STEP_MAP, RESUME_FALLBACK_STEP);

  useEffect(() => {
    if (!prefill || !formikRef.current) return;

    const { values, setFieldValue } = formikRef.current;

    if (!values.directorName && prefill.fullName) setFieldValue("directorName", prefill.fullName);
    if (!values.directorEmail && prefill.email) setFieldValue("directorEmail", prefill.email);
    if (!values.directorPhone && prefill.phone) setFieldValue("directorPhone", prefill.phone);
    if (!values.directorDob && prefill.dob) setFieldValue("directorDob", prefill.dob);
  }, [prefill]);

  useEffect(() => {
    if (!resume) return;
    setNextId(resume.nextId);
    setStep(resume.step);
    toast.info("Resuming your previous loan application.");
  }, [resume]);

  const resetModal = () => {
    setStep(0);
    setNextId(null);
    setIsLoading(false);
    setDocuments({
      lpoProof: { ...emptyDocumentState },
      addressProof: { ...emptyDocumentState },
    });
    setDocumentErrors({
      lpoProof: "",
      addressProof: "",
    });
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
    formData.append("loanType", "LOCAL_PURCHASE_ORDER");
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
      lpoProof: documents.lpoProof.url ? "" : `${documentLabels.lpoProof} is required`,
      addressProof: documents.addressProof.url ? "" : `${documentLabels.addressProof} is required`,
    };

    setDocumentErrors(nextErrors);

    return Object.values(nextErrors).every((error) => error === "");
  };

  const uploadedDocumentCount = Object.values(documents).filter((doc) => doc.url).length;
  const uploadProgress = (uploadedDocumentCount / Object.keys(documentLabels).length) * 100;

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
          loanType: "LOCAL_PURCHASE_ORDER",
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

      // Step 1 — Director's Information
      if (step === 1) {
        if (!nextId) {
          toast.error("Session error. Please restart the application.");
          return;
        }

        const result = await submitLoanPersonalInfo({
          fullName: values.directorName,
          emailAddress: values.directorEmail,
          phoneNumber: values.directorPhone,
          dateOfBirth: values.directorDob,
          BVN: values.directorBvn,
          nextId,
        });

        if (!result.success) {
          toast.error("Failed to submit director information. Please try again.");
          return;
        }

        setNextId(result.data.nextId);
        setStep(2);
        return;
      }

      // Step 2 — Company's Information
      if (step === 2) {
        if (!nextId) {
          toast.error("Session error. Please restart the application.");
          return;
        }

        const result = await submitLoanCompanyDetails({
          businessName: values.businessName,
          businessEmail: values.businessEmail,
          businessPhone: values.businessPhone,
          cacNumber: values.cacNumber,
          nextId,
        });

        if (!result.success) {
          toast.error(result.error || "Failed to submit company information. Please try again.");
          return;
        }

        setNextId(result.data.nextId);
        setStep(3);
        return;
      }

      // Step 3 (last) — Documents
      if (step === 3) {
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
    <Modal2 isOpen={isOpen} onClose={handleClose} width={647} title="Local Purchase Order">
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
                    options={LPO_LOAN_PURPOSE_OPTIONS}
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
                  <LoanInput
                    label="Director's Name"
                    placeholder="Esther Williams"
                    value={values.directorName}
                    onChange={handleChange("directorName")}
                    onBlur={handleBlur("directorName")}
                    error={touched.directorName ? errors.directorName : undefined}
                  />
                  <LoanInput
                    label="Director's Email Address"
                    placeholder="Estherwilliams22@gmail.com"
                    type="email"
                    value={values.directorEmail}
                    onChange={handleChange("directorEmail")}
                    onBlur={handleBlur("directorEmail")}
                    error={touched.directorEmail ? errors.directorEmail : undefined}
                  />
                  <LoanInput
                    label="Phone Number"
                    placeholder="Enter Director's Phone Number"
                    value={values.directorPhone}
                    onChange={handleChange("directorPhone")}
                    onBlur={handleBlur("directorPhone")}
                    error={touched.directorPhone ? errors.directorPhone : undefined}
                  />
                  <LoanInput
                    label="Date of Birth"
                    placeholder="MM/DD/YY"
                    type="date"
                    value={values.directorDob}
                    onChange={handleChange("directorDob")}
                    onBlur={handleBlur("directorDob")}
                    error={touched.directorDob ? errors.directorDob : undefined}
                  />
                  <LoanInput
                    label="BVN Number"
                    placeholder="Enter Director's BVN number"
                    value={values.directorBvn}
                    onChange={handleChange("directorBvn")}
                    onBlur={handleBlur("directorBvn")}
                    error={touched.directorBvn ? errors.directorBvn : undefined}
                  />
                </div>
              )}

              {step === 2 && (
                <div className={styles.form}>
                  <LoanInput
                    label="Business Name"
                    placeholder="Enter Business Name"
                    value={values.businessName}
                    onChange={handleChange("businessName")}
                    onBlur={handleBlur("businessName")}
                    error={touched.businessName ? errors.businessName : undefined}
                  />
                  <LoanInput
                    label="Email Address"
                    placeholder="Estherwilliams22@gmail.com"
                    type="email"
                    value={values.businessEmail}
                    onChange={handleChange("businessEmail")}
                    onBlur={handleBlur("businessEmail")}
                    error={touched.businessEmail ? errors.businessEmail : undefined}
                  />
                  <LoanInput
                    label="Phone Number"
                    placeholder="08099631681"
                    value={values.businessPhone}
                    onChange={handleChange("businessPhone")}
                    onBlur={handleBlur("businessPhone")}
                    error={touched.businessPhone ? errors.businessPhone : undefined}
                  />
                  <LoanInput
                    label="CAC Number"
                    placeholder="Enter CAC Number"
                    value={values.cacNumber}
                    onChange={handleChange("cacNumber")}
                    onBlur={handleBlur("cacNumber")}
                    error={touched.cacNumber ? errors.cacNumber : undefined}
                  />
                </div>
              )}

              {step === 3 && (
                <div className={styles.form}>
                  <p className={styles.docNote}>
                    Please upload the required documents to complete your loan application.
                    All documents should be clear and legible.
                  </p>
                  <div className={styles.progressBlock}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressLabel}>Upload progress</span>
                      <span className={styles.progressCount}>
                        {uploadedDocumentCount} of {Object.keys(documentLabels).length} files ready
                      </span>
                    </div>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                  <DocumentUpload
                    label={documentLabels.lpoProof}
                    fileName={documents.lpoProof.name}
                    uploading={documents.lpoProof.uploading}
                    uploaded={Boolean(documents.lpoProof.url)}
                    onFileChange={(file, error) => {
                      if (error) {
                        setDocumentErrors((current) => ({ ...current, lpoProof: error }));
                        return;
                      }

                      if (file) {
                        handleDocumentSelect("lpoProof", file);
                      }
                    }}
                    error={documentErrors.lpoProof}
                  />
                  <DocumentUpload
                    label={documentLabels.addressProof}
                    fileName={documents.addressProof.name}
                    uploading={documents.addressProof.uploading}
                    uploaded={Boolean(documents.addressProof.url)}
                    onFileChange={(file, error) => {
                      if (error) {
                        setDocumentErrors((current) => ({ ...current, addressProof: error }));
                        return;
                      }

                      if (file) {
                        handleDocumentSelect("addressProof", file);
                      }
                    }}
                    error={documentErrors.addressProof}
                  />
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

export default LocalPurchaseOrderModal;