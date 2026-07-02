"use client";
import { useState } from "react";
import EmptyInstant from "./components/emptyInstant";
import EmptyDash from "./components/emptyDashboard/page";

// TODO: refactor this into a data fetching server component and a client component for visuals
const Loan = () => {
  // TODO: this conditional will soon be based on the backend state
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  return (
    <div>
      {isDashboardVisible ? (
        <EmptyDash />
      ) : (
        <EmptyInstant setIsDashboardVisible={setIsDashboardVisible} />
      )}
    </div>
  );
};

export default Loan;
