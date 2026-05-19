"use client";
import React from "react";
import styles from "./Modal.module.css";
import Spinner from "@/components/LoadingSpinner";

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  isLoading?: boolean;
  width?: string | number;
};

const Modal2 = ({
  isOpen,
  children,
  onClose,
  isLoading = false,
  width = 500,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ width: typeof width === "number" ? `${width}px` : width }}
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        )}
        {isLoading ? <Spinner /> : children}
      </div>
    </div>
  );
};

export default Modal2;