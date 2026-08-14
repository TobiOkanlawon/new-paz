"use client";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BsCheckCircleFill } from "react-icons/bs";
import Modal2 from "@/components/Modal2";
import Button from "@/components/Button";
import {
  useGetPendingLoanRequests,
  isFinalizedLoanId,
} from "@/data/queries/useGetPendingLoanRequests";
import useConsentToLoan from "@/data/mutations/useConsentToLoan";
import TermsAndConditionModal from "../TermsAndConditionModal/TermsAndConditionModal";
import styles from "./LoanConsentModal.module.css";

const LoanConsentModal = () => {
  const queryClient = useQueryClient();

  const { data: pendingRequests } = useGetPendingLoanRequests();

  const [agreed, setAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Approved-and-awaiting-consent request whose OtherInfo has settled into a
  // bare numeric loan id (see isFinalizedLoanId) rather than a step token.
  const approvedLoan = pendingRequests?.find(
    (request) =>
      request.Approved && !request.Consent && isFinalizedLoanId(request.OtherInfo),
  );

  const loanId = approvedLoan?.OtherInfo ?? "";

  const consentMutation = useConsentToLoan(loanId);

  const isOpen = Boolean(approvedLoan) && !dismissed;

  const handleCancel = () => {
    setDismissed(true);
    setAgreed(false);
  };

  const handleAccept = () => {
    if (!agreed) return;
    consentMutation.mutate(
      { consent: true },
      {
        onSuccess: () => {
          toast("Loan offer accepted");
          queryClient.invalidateQueries({ queryKey: ["get-pending-loan-requests"] });
        },
        onError: () => {
          toast("Could not accept loan offer, please try again");
        },
      },
    );
  };

  return (
    <>
      <Modal2 isOpen={isOpen} onClose={handleCancel} width={460}>
        <div className={styles.container}>
          <div className={styles.iconWrap}>
            <BsCheckCircleFill size={28} color="#17A842" />
          </div>
          <h2 className={styles.title}>Your loan is approved!</h2>
          <p className={styles.subtitle}>Review and accept your loan offer below</p>

          <div className={styles.summary}>
            <div className={styles.row}>
              <span className={styles.label}>Loan Amount :</span>
              <span className={styles.value}>
                ₦{(approvedLoan?.ApprovedAmount || approvedLoan?.Amount || 0).toLocaleString()}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Interest rate :</span>
              <span className={styles.value}>5%/month</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Repayment Period :</span>
              <span className={styles.value}>{approvedLoan?.Tenor ?? "—"}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.row}>
              <span className={styles.label}>Amount Repaid:</span>
              <span className={styles.value}>—</span>
            </div>
          </div>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className={styles.checkboxLabel}>
              I have read and agree to the{" "}
              <span className={styles.link} onClick={() => setTermsOpen(true)}>
                loan terms and conditions
              </span>{" "}
              and authorize PAZ to debit my account for the repayment amount stated above.
            </span>
          </label>

          <div className={styles.footer}>
            <Button variant="outlined" className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!agreed}
              loading={consentMutation.isPending}
              onClick={handleAccept}
            >
              Accept loan offer
            </Button>
          </div>
        </div>
      </Modal2>

      <TermsAndConditionModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
};

export default LoanConsentModal;
