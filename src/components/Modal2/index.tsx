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
  title?: string;
};

const Modal2 = ({
  isOpen,
  children,
  onClose,
  isLoading = false,
  width,
  title,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ width: typeof width === "number" ? `${width}px` : width }}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {onClose && (
              <button className={styles.headerClose} onClick={onClose}>
                ×
              </button>
            )}
          </div>
        ) : (
          onClose && (
            <button className={styles.closeBtn} onClick={onClose}>
              ×
            </button>
          )
        )}
        {isLoading ? <Spinner /> : children}
      </div>
    </div>
  );
};

export default Modal2;