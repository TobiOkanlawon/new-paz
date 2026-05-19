import React from "react";
import styles from "./LoanApplicationResult.module.css";
import Modal2 from "@/components/Modal2";
import Button from "@/components/Button";
import { BsCheckCircleFill } from "react-icons/bs";
import { PiWarningFill } from "react-icons/pi";

type Props = {
  status: "success" | "pending";
  onBack?: VoidFunction;
  isOpen: boolean;
  onClose: VoidFunction;
};

const config = {
  success: {
    icon: <BsCheckCircleFill size={48} color="#17A842" />,
    title: "Loan Application",
    message: "Your loan application was successful.",
  },
  pending: {
    icon: <PiWarningFill size={48} color="#E09A1A" />,
    title: "Loan Application",
    message: "Your loan application is currently pending for review.",
  },
};

const LoanApplicationResult = ({ status, onBack, isOpen, onClose }: Props) => {
  const { icon, title, message } = config[status];
  return (
    <Modal2 isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        {icon}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <Button variant="primary" onClick={onBack}>Back</Button>
      </div>
    </Modal2>
  );
};

export default LoanApplicationResult;