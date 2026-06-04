import React, { useState } from "react";
import Modal2 from "@/components/Modal2";
import LoanTabs from "../../shared/LoanTabs";
import LoanSelect from "../../shared/LoanSelect";
import LoanInput from "../../shared/LoanInput";
import LoanFormFooter from "../../shared/LoanFormFooter";
import DocumentUpload from "../../shared/DocumentUpload";
import TermsAndConditionModal from "../TermsAndConditionModal/TermsAndConditionModal";
import styles from "./AssetFinanceLoanModal.module.css";
import Button from "@/components/Button";

const TABS = ["Loan Details", "Asset Type", "Personal Information", "Guarantor", "Documents"];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
  onMakePayment?: VoidFunction;
};

const AssetFinanceLoanModal = ({ isOpen, onClose, onSubmit, onMakePayment }: Props) => {
  const [step, setStep] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, TABS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <>
      <Modal2 isOpen={isOpen} onClose={onClose} width={647}>
        <div className={styles.container}>
          <h2 className={styles.title}>Asset Finance Loan</h2>
          <LoanTabs tabs={TABS} activeTab={step} />

          {step === 0 && (
            <div className={styles.form}>
              <LoanInput label="Loan Type" placeholder="Asset Finance Loan" />
              <LoanSelect label="Loan Amount" options={["2,000,000", "5,000,000"]} placeholder="2,000,000" />
              <LoanSelect label="Loan Tenure" options={["3 months", "6 months", "9 months", "12 months"]} placeholder="9 months" />
              <LoanInput label="Purpose of Loan" placeholder="Asset Purchase" />
            </div>
          )}

          {step === 1 && (
            <div className={styles.form}>
              <LoanSelect label="Assets Name" options={["Car", "Motorcycle", "Machinery", "Equipment"]} placeholder="Car" />
              <LoanInput label="Asset Amount" placeholder="2,000,000" />
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span className={styles.checkboxLabel}>
                  I agree to{" "}
                  <span className={styles.link} onClick={() => setTermsOpen(true)}>
                    terms and agreement of contract
                  </span>
                </span>
              </label>
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
              <LoanInput label="Name" placeholder="Lagos, Nigeria" />
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
              <DocumentUpload label="Asset Proof (Invoice)" />
              <div className={styles.docFooter}>
                <Button variant="primary" onClick={onMakePayment}>Make Payment</Button>
                <LoanFormFooter
                  onBack={back}
                  onContinue={onSubmit}
                  continueLabel="Submit Application"
                />
              </div>
            </div>
          )}

          {step !== 4 && (
            <LoanFormFooter
              onBack={back}
              onContinue={next}
              continueLabel="Continue"
            />
          )}
        </div>
      </Modal2>

      <TermsAndConditionModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
      />
    </>
  );
};

export default AssetFinanceLoanModal;