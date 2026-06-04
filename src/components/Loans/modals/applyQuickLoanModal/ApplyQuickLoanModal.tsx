import React, { useState } from "react";
import Modal2 from "@/components/Modal2";
import LoanTabs from "../../shared/LoanTabs";
import LoanSelect from "../../shared/LoanSelect";
import LoanInput from "../../shared/LoanInput";
import LoanFormFooter from "../../shared/LoanFormFooter";
import styles from "./ApplyQuickLoanModal.module.css";

const TABS = ["Loan Details", "Employment", "Personal Information"];

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit?: VoidFunction;
};

const ApplyQuickLoanModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [step, setStep] = useState(0);
  const [loanType, setLoanType] = useState("Quick Loan");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [bvn, setBvn] = useState("");

  const next = () => setStep((s) => Math.min(s + 1, TABS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Modal2 isOpen={isOpen} onClose={onClose} width={627} title="Apply For Quick Loan">
      <div className={styles.container}>
        <LoanTabs tabs={TABS} activeTab={step} />

        {step === 0 && (
          <div className={styles.form}>
            <LoanSelect label="Loan Type" options={["Quick Loan"]} value={loanType} onChange={(e) => setLoanType(e.target.value)} />
            <LoanSelect label="Loan Amount" options={["20,000", "50,000", "100,000"]} value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="20,000" />
            <LoanSelect label="Loan Tenure" options={["30 days", "60 days", "90 days"]} value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} placeholder="30 days" />
            <LoanInput label="Purpose of Loan" placeholder="Wig" value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)} />
          </div>
        )}

        {step === 1 && (
          <div className={styles.form}>
            <LoanSelect label="Employment Status" options={["Employed", "Self-employed", "Unemployed"]} value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)} placeholder="Employed" />
            <LoanInput label="Monthly Income" placeholder="500,000" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
          </div>
        )}

        {step === 2 && (
          <div className={styles.form}>
            <LoanInput label="Full Name" placeholder="Esther Williams" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <LoanInput label="Email Address" placeholder="Estherwilliams22@gmail.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <LoanInput label="Phone Number" placeholder="08099631681" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <LoanInput label="Date of Birth" placeholder="MM/DD/YY" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            <LoanInput label="BVN Number" placeholder="Enter Number" value={bvn} onChange={(e) => setBvn(e.target.value)} />
          </div>
        )}

        <LoanFormFooter
          onBack={back}
          onContinue={step === TABS.length - 1 ? onSubmit : next}
          continueLabel={step === TABS.length - 1 ? "Submit" : "Continue"}
        />
      </div>
    </Modal2>
  );
};

export default ApplyQuickLoanModal;