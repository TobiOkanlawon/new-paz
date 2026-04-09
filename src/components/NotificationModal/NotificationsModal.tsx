import React, { useMemo, useState } from "react";
import styles from "./notificationsModal.module.css";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";

export type NotificationItem = {
  id: string;
  title: string;
  subtitle?: string;
  createdAt: string; // "3 days ago" or ISO (you decide)
  read: boolean;
};

type TabKey = "all" | "unread" | "read";

type Props = {
  open: boolean;
  onClose: () => void;

  notifications: NotificationItem[];

  onMarkAllRead?: () => void;
  onOpenNotification?: (id: string) => void;

  title?: string; // default "Notifications"
};

const NotificationsModal = ({
  open,
  onClose,
  notifications,
  onMarkAllRead,
  onOpenNotification,
  title = "Notifications",
}: Props) => {
  const [tab, setTab] = useState<TabKey>("all");

  const filtered = useMemo(() => {
    if (tab === "all") return notifications;
    if (tab === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.read);
  }, [notifications, tab]);

  const tabs: { key: TabKey; label: string; count: number }[] = useMemo(
    () => [
      { key: "all", label: "All", count: notifications.length },
      { key: "unread", label: "Unread", count: notifications.filter((n) => !n.read).length },
      { key: "read", label: "Read", count: notifications.filter((n) => n.read).length },
    ],
    [notifications]
  );

  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.drawer}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IoClose size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.topRow}>
            <button
              className={styles.markAll}
              type="button"
              onClick={onMarkAllRead}
              disabled={!onMarkAllRead}
            >
              Mark all as read
            </button>
          </div>

          <div className={styles.tabs}>
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`${styles.tabBtn} ${tab === t.key ? styles.activeTab : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.list}>
            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>No notifications</p>
                <p className={styles.emptySub}>You’re all caught up.</p>
              </div>
            ) : (
              filtered.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={styles.item}
                  onClick={() => onOpenNotification?.(n.id)}
                >
                  <div className={styles.itemMain}>
                    <div className={styles.itemTitleRow}>
                      <p className={styles.itemTitle}>{n.title}</p>
                      {!n.read && <span className={styles.dot} />}
                    </div>

                    {n.subtitle && <p className={styles.itemSub}>{n.subtitle}</p>}
                    <p className={styles.itemTime}>{n.createdAt}</p>
                  </div>

                  {n.read && (
                    <IoCheckmarkCircle className={styles.readIcon} />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default NotificationsModal;