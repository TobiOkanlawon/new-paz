import React, { useState } from "react";
import Modal2 from "@/components/Modal2";
import LoanTabs from "../../shared/LoanTabs";
import LoanSelect from "../../shared/LoanSelect";
import LoanInput from "../../shared/LoanInput";
import LoanFormFooter from "../../shared/LoanFormFooter";
import DocumentUpload from "../../shared/DocumentUpload";
import styles from "./LocalPurchaseOrderModal.module.css";

const TABS = ["Loan Details", "Director's Information", "Company's Information", "Documents"];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
};

const LocalPurchaseOrderModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, TABS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Modal2 isOpen={isOpen} onClose={onClose} width={647}>
      <div className={styles.container}>
        <h2 className={styles.title}>Local Purchase Order</h2>
        <LoanTabs tabs={TABS} activeTab={step} />

        {step === 0 && (
          <div className={styles.form}>
            <LoanInput label="Loan Type" placeholder="Local Purchase Order" />
            <LoanSelect label="Loan Amount" options={["500,000", "1,000,000"]} placeholder="500,000" />
            <LoanSelect label="Loan Tenure" options={["3 months", "6 months", "12 months"]} placeholder="6 months" />
            <LoanInput label="Purpose of Loan" placeholder="Business expansion" />
          </div>
        )}

        {step === 1 && (
          <div className={styles.form}>
            <LoanInput label="Director's Name" placeholder="Esther Williams" />
            <LoanInput label="Director's Email Address" placeholder="Estherwilliams22@gmail.com" type="email" />
            <LoanInput label="Phone Number" placeholder="08099631681" />
            <LoanInput label="BVN Number" placeholder="Enter BVN number" />
          </div>
        )}

        {step === 2 && (
          <div className={styles.form}>
            <LoanInput label="Business Name" placeholder="ChowNG" />
            <LoanInput label="Email Address" placeholder="Estherwilliams22@gmail.com" type="email" />
            <LoanInput label="Phone Number" placeholder="08099631681" />
            <LoanInput label="CAC Number" placeholder="Enter Number" />
          </div>
        )}

        {step === 3 && (
          <div className={styles.form}>
            <p className={styles.docNote}>
              Please upload the required documents to complete your loan application.
              All documents should be clear and legible.
            </p>
            <DocumentUpload label="LPO Proof (Local Purchase Order)" />
            <DocumentUpload label="Address Proof (Bank Statement)" />
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

export default LocalPurchaseOrderModal;