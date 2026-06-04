import React, { useState } from "react";
import Modal2 from "@/components/Modal2";
import LoanTabs from "../../shared/LoanTabs";
import LoanInput from "../../shared/LoanInput";
import LoanSelect from "../../shared/LoanSelect";
import LoanFormFooter from "../../shared/LoanFormFooter";
import DocumentUpload from "../../shared/DocumentUpload";
import styles from "./ApplyProjectFinanceLoanModal.module.css";

const TABS = ["Project Details", "Amount Details", "Project Expectation", "Founders Details", "Documents"];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
};

const ApplyProjectFinanceLoanModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, TABS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Modal2 isOpen={isOpen} onClose={onClose} width={647}>
      <div className={styles.container}>
        <h2 className={styles.title}>Apply For Project Finance Loan</h2>
        <LoanTabs tabs={TABS} activeTab={step} />

        {step === 0 && (
          <div className={styles.form}>
            <LoanInput label="Project Name" placeholder="Personal Loan" />
            <LoanSelect
              label="Industry"
              options={["Agriculture", "Technology", "Manufacturing", "Real Estate"]}
              placeholder="Agriculture"
            />
            <LoanSelect
              label="Location"
              options={["Lagos", "Abuja", "Port Harcourt", "Kano"]}
              placeholder="90 days"
            />
            <div className={styles.textareaWrapper}>
              <label className={styles.textareaLabel}>Project Description</label>
              <textarea
                className={styles.textarea}
                placeholder="Give a brief Description"
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className={styles.form}>
            <LoanInput label="Amount Needed" placeholder="5,000,000" />
            <div className={styles.textareaWrapper}>
              <label className={styles.textareaLabel}>Your Contribution</label>
              <textarea
                className={styles.textarea}
                placeholder="What will you be contributing (cash, assets, expertise)"
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.form}>
            <LoanInput label="Expected Returns" placeholder="Esther Williams" />
            <LoanSelect
              label="Profit Sharing"
              options={["50:50", "60:40", "70:30"]}
              placeholder="50:50"
            />
            <LoanSelect
              label="Timeline"
              options={["6 months", "1 year", "2 years"]}
              placeholder="1 year"
            />
          </div>
        )}

        {step === 3 && (
          <div className={styles.form}>
            <LoanInput label="Founder's Name" placeholder="Esther Williams" />
            <LoanInput label="Email Address" placeholder="Estherwilliams22@gmail.com" type="email" />
            <LoanInput label="Phone Number" placeholder="08099631681" />
            <LoanInput label="BVN Number" placeholder="Enter BVN number" />
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
            <DocumentUpload label="Project Documents" />
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

export default ApplyProjectFinanceLoanModal;