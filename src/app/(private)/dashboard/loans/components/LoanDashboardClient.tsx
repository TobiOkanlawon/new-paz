"use client";
import { useState } from "react";
import EmptyInstant from "./emptyInstant";
import EmptyDash from "./emptyDashboard/page";

type Props = {
  initialHasActiveLoan: boolean;
};

const LoanDashboardClient = ({ initialHasActiveLoan }: Props) => {
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
        />
      ) : (
        <EmptyInstant onEligible={handleEligible} />
      )}
    </div>
  );
};

export default LoanDashboardClient;
