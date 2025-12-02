import React, { useEffect, useRef } from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import NotificationDropdown from "@/components/NotificationDropdown";
import Link from "next/link";

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        const navHeight = navRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${navHeight}px`
        );
      }
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);

    return () => window.removeEventListener("resize", updateNavHeight);
  }, []);

  return (
    <nav ref={navRef} className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <Image
            src="/hamburger.png"
            alt="Hamburger"
            width={18}
            height={22}
            onClick={onToggleSidebar}
            className={styles.hamburger}
          />
          <Link href="/">
            <Image
              src="/PAZLogo.png"
              alt="Logo"
              width={87}
              height={22.61}
              className={styles.logo}
            />
          </Link>
        </div>
        <div className={styles.opContainer}>
          <Link href="/notification">
            <Image
              src="/notificationBell.png"
              alt="Notifications"
              className={styles.notificationBell}
              width={16}
              height={20}
            />
          </Link>
          <NotificationDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
