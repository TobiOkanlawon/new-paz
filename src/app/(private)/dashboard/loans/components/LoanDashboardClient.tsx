"use client";
import { useState } from "react";
import EmptyInstant from "./emptyInstant";
import EmptyDash from "./emptyDashboard/page";
import type { ActiveLoanData, LoanProduct } from "@/actions/loans";

type Props = {
  initialHasActiveLoan: boolean;
  initialHasPendingLoanRequest: boolean;
  initialActiveLoan?: ActiveLoanData;
  initialLoanProducts: LoanProduct[];
};

const LoanDashboardClient = ({
  initialHasActiveLoan,
  initialHasPendingLoanRequest,
  initialActiveLoan,
  initialLoanProducts,
}: Props) => {
  // A pending (not-yet-approved) application has no active loan yet, but
  // still needs the status/gating view rather than the plain eligibility
  // flow — otherwise a user with a pending request could walk right back
  // into applying for a second loan.
  const [isDashboardVisible, setIsDashboardVisible] = useState(
    initialHasActiveLoan || initialHasPendingLoanRequest,
  );
  const [autoOpenApply, setAutoOpenApply] = useState(false);

  const handleEligible = () => {
    setAutoOpenApply(true);
    setIsDashboardVisible(true);
  };

  return (
    <div>
      {isDashboardVisible ? (
        <EmptyDash
          autoOpenApply={autoOpenApply}
          onAutoOpenApplyHandled={() => setAutoOpenApply(false)}
          hasPendingLoanRequest={initialHasPendingLoanRequest}
          activeLoan={initialActiveLoan}
          loanProducts={initialLoanProducts}
        />
      ) : (
        <EmptyInstant onEligible={handleEligible} />
      )}
    </div>
  );
};

export default LoanDashboardClient;
