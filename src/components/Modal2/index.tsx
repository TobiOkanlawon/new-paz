import React from "react";
import styles from "./Modal.module.css";
import Spinner from "@/components/LoadingSpinner";

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  isLoading?: boolean;
};

const Modal2 = ({
  isOpen,
  children,
  onClose,
  isLoading = false,
}: ModalProps) => {
  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className={styles.overlay} onClick={onClose && onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        )}
          <Spinner />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.overlay} onClick={onClose && onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal2;
