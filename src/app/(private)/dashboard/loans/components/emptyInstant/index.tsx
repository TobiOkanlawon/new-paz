"use client";
import { useState } from "react";
import style from "./emptyInstant.module.css";
import LoanHeader from "../loanHeader";
import Image from "next/image";
import Button from "@/components/Button";
import EligibilityModal from "../modals/eligibilityModal/EligibilityModal";

type Props = {
  onEligible: VoidFunction;
};

const EmptyInstant: React.FC<Props> = ({ onEligible }) => {
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  return (
    <div className={style.container}>
      <LoanHeader
        title="Loans"
        desc="Manage your loans and explore financing options"
      />
      <div className={style.emptyContainer}>
        <div className={style.mediaContainer}>
          <Image
            src="/images/instantLoan.png"
            alt="get instant loan"
            width={300}
            height={300}
          />
          <h2>Get an Loan</h2>
          <p>
            To ensure if you qualify for a loan and comply with regulatory
            requirements, we need to check your eligibility.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsEligibilityOpen(true)}
        >
          Check Eligibility
        </Button>
      </div>

      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        navigateToNext={onEligible}
      />
    </div>
  );
};

export default EmptyInstant;
