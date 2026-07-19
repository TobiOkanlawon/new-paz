import React from "react";
import Button from "@/components/Button";
import styles from "./LoanFormFooter.module.css";

type Props = {
  onBack?: VoidFunction;
  onContinue?: VoidFunction;
  continueLabel?: string;
  loading?: boolean;
  isSubmitButton?: boolean;
};

const LoanFormFooter = ({
  onBack,
  onContinue,
  continueLabel = "Continue",
  loading = false,
  isSubmitButton = false,
}: Props) => (
  <div className={styles.footer}>
    <Button variant="outlined2" onClick={onBack}>Back</Button>
    <Button
      variant="primary"
      onClick={onContinue}
      loading={loading}
      type={isSubmitButton ? "submit" : "button"}
    >
      {continueLabel}
    </Button>
  </div>
);

export default LoanFormFooter;