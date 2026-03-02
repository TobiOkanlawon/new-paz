import React from "react";
import styles from "./notificationDetailModal.module.css";
import Button from "@/components/Button";
import { IoCheckmark, IoClose } from "react-icons/io5";

export type NotificationDetail = {
  id: string;
  title: string;
  dateTime: string; // "Jan 21, 2022 3:45pm"
  statusLabel?: string; // e.g. "Loan request successful"
  statusType?: "success" | "info" | "warning" | "error";
  body: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: NotificationDetail | null;
};

const NotificationDetailModal = ({ open, onClose, data }: Props) => {
  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Notification</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IoClose size={24} />
          </button>
        </div>

        <div className={styles.body}>
          {!data ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>No notification selected.</p>
            </div>
          ) : (
            <div className={styles.wrap}>
              <div className={styles.metaRow}>
                <div className={styles.metaLeft}>
                  <span className={styles.metaTitle}>
                    {data.statusLabel ?? data.title}
                  </span>

                  {data.statusType === "success" && (
                    <span className={styles.badgeSuccess} aria-label="success">
                      <IoCheckmark />
                    </span>
                  )}
                </div>

                <span className={styles.metaRight}>{data.dateTime}</span>
              </div>

              <div className={styles.bodyText}>{data.body}</div>

              <div className={styles.footer}>
                <div className={styles.buttonContainer}>
                  <Button variant="outlined" onClick={onClose} className={styles.cancelBtn}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDetailModal;