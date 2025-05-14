'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './notification.module.css';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBellClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation(); 
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <div className={styles.notificationContainer} ref={dropdownRef}>
      <img
        src="/notificationBell.png"
        alt="Notifications"
        className={styles.notificationBell}
        onClick={handleBellClick}
        aria-expanded={open}
        aria-controls="notification-dropdown"
      />

      <div
        id="notification-dropdown"
        className={`${styles.notificationDropdown} ${open ? styles.open : ''}`}
      >
        <p className={styles.notificationHeader}>Notifications</p>
        <ul className={styles.notificationList}>
          <li className={styles.notificationItem}>No messages</li>
        </ul>
      </div>
    </div>
  );
}
