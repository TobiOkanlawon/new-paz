import React from "react";
import styles from "./LoanInput.module.css";

type Props = {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
  error?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const LoanInput = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  rightElement,
  error,
  // Loan application fields shouldn't offer the browser's "you typed this
  // here before" suggestions: picking one isn't guaranteed to fire a real
  // input event in every browser, which can leave formik's state stale
  // (field looks filled, submitted value isn't) while looking identical to
  // a normal filled field. Off by default; callers can still override it.
  autoComplete = "off",
  ...rest
}: Props) => (
  <div className={styles.wrapper}>
    <label className={styles.label}>{label}</label>
    <div className={styles.inputRow}>
      <input
        className={`${styles.input}${error ? ` ${styles.inputError}` : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        {...rest}
      />
      {rightElement && <span className={styles.right}>{rightElement}</span>}
    </div>
    {error && <span className={styles.errorMessage}>{error}</span>}
  </div>
);

export default LoanInput;
