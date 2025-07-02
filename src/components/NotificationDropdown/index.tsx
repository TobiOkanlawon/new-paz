'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './notification.module.css';
import Link from 'next/link';

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
      <div className={styles.userContainer}>
        <Image
          src="/defaultDP.png"
          alt="User"
          width={30}
          height={30}
          onClick={handleBellClick}
          aria-expanded={open}
          aria-controls="notification-dropdown"
          className="cursor-pointer"
        />
        <Image
          src="/userDropdown.png"
          alt="Arrow"
          width={8}
          height={4}
          className="cursor-pointer"
        />
      </div>

      <div
        id="notification-dropdown"
        className={`${styles.navDropdown} ${open ? styles.open : ''}`}
      >
        <Link href='/profile'>
          <Image src={'/profileDropdown.png'} alt='Profile Icon' width={20} height={20}/>
          <p>Profile</p>
        </Link>
        <Link href='/setting'>
          <Image src={'/settingDropdown.png'} alt='Settings Icon' width={20} height={20}/>
          <p>Setting</p>
        </Link>
      </div>
    </div>
  );
}
