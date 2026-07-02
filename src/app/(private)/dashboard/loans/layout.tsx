import React from "react";
import LoanConsentModal from "./components/modals/LoanConsentModal/LoanConsentModal";

export default function LoansLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoanConsentModal />
      {children}
    </>
  );
}
