import { useEffect, useState } from "react";
import { getPendingLoan } from "@/actions/loans";

export type LoanResumeState = {
  nextId: string;
  step: number;
} | null;

/**
 * Detects an in-progress loan application (via GET /v1/user/loan/pending)
 * when a wizard opens, and resolves which step to resume at.
 *
 * `OtherInfo` on the pending record is the nextId to feed into the wizard's
 * *next* API call, and its prefix names which submit function that call is
 * for (e.g. "IPE-..." -> next call is submitLoanPersonalInfo). This is
 * inferred from observed values, not an officially documented contract —
 * see docs/loans-backend-integration.md. `prefixStepMap` maps each known
 * prefix to the step index in the CALLING wizard's own step order (the same
 * prefix can land on a different step index in different wizards, since
 * wizards call these functions in different orders).
 *
 * Unrecognized prefixes always fall back to `fallbackStep` (the earliest
 * post-apply step) rather than guessing further ahead — repeating a step
 * the user already completed is safe, silently skipping one that the
 * backend still expects is not.
 *
 * Known limitation: the pending-loan response has no loanType field, so
 * this can't verify the pending record actually belongs to the wizard
 * being opened. Safe only because entry points are gated to block opening
 * a different loan type while one is already pending (see EmptyDash).
 */
export function useLoanResume(
  isOpen: boolean,
  prefixStepMap: Record<string, number>,
  fallbackStep: number,
): LoanResumeState {
  const [resume, setResume] = useState<LoanResumeState>(null);

  useEffect(() => {
    if (!isOpen) {
      setResume(null);
      return;
    }

    let cancelled = false;

    getPendingLoan().then((result) => {
      if (cancelled) return;

      const otherInfo = result.success ? result.data.data?.OtherInfo : undefined;
      if (!otherInfo) {
        setResume(null);
        return;
      }

      const prefix = otherInfo.split("-")[0];
      const step = prefixStepMap[prefix] ?? fallbackStep;

      setResume({ nextId: otherInfo, step });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return resume;
}
