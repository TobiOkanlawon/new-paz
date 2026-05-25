import React from "react";
import Modal2 from "@/components/Modal2";
import styles from "./TermsAndConditionModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
};

const TermsAndConditionModal = ({ isOpen, onClose }: Props) => (
  <Modal2 isOpen={isOpen} onClose={onClose} width={647}>
    <div className={styles.container}>
      <h2 className={styles.title}>Terms and condition</h2>
      <div className={styles.content}>
        <p>
          Welcome to PAZ. These Terms and Conditions ("Terms") govern your use
          and loan application of our webApp, PAZ, and the services we provide.
          By accessing or using our services, you agree to comply with and be
          bound by these Terms. Please read them carefully.
        </p>
        <h3 className={styles.sectionTitle}>Acceptance of Terms</h3>
        <p>
          By requesting for a loan on our web App, or using our services, you
          confirm that you accept these Terms and agree to abide by them. If you
          do not agree with any part of these Terms, please do not use our
          services. To be able to access the Asset Finance Loan, you agree to
          depositing 20% fee of the Asset worth to us and we will help you
          acquire it.
        </p>
      </div>
    </div>
  </Modal2>
);

export default TermsAndConditionModal;