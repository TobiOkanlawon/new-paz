import React from "react";
import styles from "./Modal.module.css";
import Spinner from "@/components/LoadingSpinner";

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
};

const Modal2 = ({
  isOpen,
  children,
  isLoading = false,
}: ModalProps) => {
  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <Spinner />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal2;
