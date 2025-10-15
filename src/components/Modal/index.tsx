import React from "react";
import styles from "./Modal.module.css";
import Spinner from "@/components/LoadingSpinner";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  isLoading = false,
}: ModalProps) => {
  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
          <Spinner />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
