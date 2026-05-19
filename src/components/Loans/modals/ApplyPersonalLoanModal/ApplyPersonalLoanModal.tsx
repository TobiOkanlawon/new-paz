import React, { useState } from "react";
import Modal2 from "@/components/Modal2";
import LoanTabs from "../../shared/LoanTabs";
import LoanSelect from "../../shared/LoanSelect";
import LoanInput from "../../shared/LoanInput";
import LoanFormFooter from "../../shared/LoanFormFooter";
import DocumentUpload from "../../shared/DocumentUpload";
import styles from "./ApplyPersonalLoanModal.module.css";

const TABS = ["Loan Details", "Employment", "Personal Information", "Guarantor", "Documents"];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
};

const ApplyPersonalLoanModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, TABS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Modal2 isOpen={isOpen} onClose={onClose} width={647} title="Apply For Personal Loan">
      <div className={styles.container}>
        <LoanTabs tabs={TABS} activeTab={step} />

        {step === 0 && (
          <div className={styles.form}>
            <LoanSelect label="Loan Type" options={["Personal Loan"]} value="Personal Loan" />
            <LoanSelect label="Loan Amount" options={["250,000", "500,000"]} placeholder="250,000" />
            <LoanSelect label="Loan Tenure" options={["30 days", "60 days", "90 days"]} placeholder="90 days" />
            <LoanInput label="Purpose of Loan" placeholder="House Rent" />
          </div>
        )}

        {step === 1 && (
          <div className={styles.form}>
            <LoanSelect label="Employment Status" options={["Employed", "Self-employed", "Unemployed"]} placeholder="Employed" />
            <LoanInput label="Monthly Income" placeholder="500,000" />
          </div>
        )}

        {step === 2 && (
          <div className={styles.form}>
            <LoanInput label="Full Name" placeholder="Esther Williams" />
            <LoanInput label="Email Address" placeholder="Estherwilliams22@gmail.com" type="email" />
            <LoanInput label="Phone Number" placeholder="08099631681" />
            <LoanInput label="Date of Birth" placeholder="MM/DD/YY" type="date" />
            <LoanInput label="BVN Number" placeholder="Enter Number" />
          </div>
        )}

        {step === 3 && (
          <div className={styles.form}>
            <LoanInput label="Name" placeholder="Esther Williams" />
            <LoanInput label="Phone Number" placeholder="08099631681" />
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
          </div>
        )}

        <LoanFormFooter
          onBack={back}
          onContinue={step === TABS.length - 1 ? onSubmit : next}
          continueLabel={step === TABS.length - 1 ? "Submit Application" : "Continue"}
        />
      </div>
    </Modal2>
  );
};

export default ApplyPersonalLoanModal;