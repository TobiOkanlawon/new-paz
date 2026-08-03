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
  const [isDashboardVisible, setIsDashboardVisible] = useState(initialHasActiveLoan);
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
