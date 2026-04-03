import React from "react";
import styles from "./button.module.css";
import clsx from "clsx";
import Spinner from "../LoadingSpinner";

type Props = {
  label?: string;
  variant?: "primary" | "secondary" | "outlined"| "outlined2";
  loading?: boolean;
  children?: React.ReactNode;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = ({
  className,
  type = "button",
  variant = "primary",
  loading = false,
  disabled,
  children,
  label,
  ...rest
}: Props) => {
  const variantClass = {
    primary: styles.primary,
    secondary: styles.secondary,
    outlined: styles.outlined,
    outlined2: styles.outlined2
  }[variant];

  return (
    <button
      type={type}
      className={clsx(styles.button, variantClass, className, {
        [styles.disabled]: disabled || loading,
      })}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Spinner className={styles.spinner} />
      ) : (
        children || label
      )}
    </button>
  );
};
export default Button;
