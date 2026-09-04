"use client";
import React from "react";
import styles from "./button.module.css";
import clsx from "clsx";
import Spinner from "../LoadingSpinner";
import { motion } from "framer-motion";

type Props = {
  label?: string;
  variant?: "primary" | "secondary" | "outlined" | "outlined2" | "pending";
  loading?: boolean;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

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
    outlined2: styles.outlined2,
    pending: styles.pending,
  }[variant];

  return (
    <motion.button
      type={type}
      className={clsx(styles.button, variantClass, className, {
        [styles.disabled]: disabled || loading,
      })}
      disabled={disabled || loading}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        mass: 1,
        stiffness: 80,
        damping: 20,
      }}
      {...(rest as any)}
    >
      {loading ? <Spinner className={styles.spinner} /> : children || label}
    </motion.button>
  );
};

export default Button;