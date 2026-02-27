"use client";
import Image from "next/image";
import styles from "./header.module.css";
import { useRef, useEffect, useState } from "react";

import Notifications from "@/assets/notifications.png";
import ProfileImage from "@/assets/profile-dummy.png";
import StarIcon from "@/assets/star.png";

const Header = () => {
  const navRef = useRef<HTMLDivElement>(null);

  const [firstName] = useState("Esther");

  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        const navHeight = navRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${navHeight}px`,
        );
      }
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);

    return () => window.removeEventListener("resize", updateNavHeight);
  }, []);

  return (
    <div ref={navRef} className={styles.header}>
      <nav className={styles.headerRight}>
        <div className={styles.quickActionsContainer}>
          <Image src={StarIcon} alt="red star icon" />
          <p className={styles.quickActionsText}>Quick actions</p>
        </div>

        <div className={styles.headerRightRight}>
          <Image src={Notifications} alt="Notifications" />
          <div className={styles.profileContainer}>
            <Image src={ProfileImage} alt="Profile Image" />
            <p className={styles.profileFirstName}>{firstName}</p>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
