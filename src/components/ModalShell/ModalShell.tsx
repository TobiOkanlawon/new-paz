import React, { useEffect } from "react";
import styles from "./modalShell.module.css";
import { IoClose } from "react-icons/io5";

type Props = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  width?: number; // px
};

const ModalShell = ({ open, title, children, onClose, width = 520 }: Props) => {
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.modal}
        style={{ width }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>

          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <IoClose size={20} />
          </button>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default ModalShell;