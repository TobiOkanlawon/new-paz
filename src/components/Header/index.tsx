"use client";
import Image from "next/image";
import styles from "./header.module.css";
import { useRef, useEffect, useState, useMemo } from "react";
import NotificationsModal, {
  NotificationItem,
} from "@/components/NotificationModal/NotificationsModal";
import NotificationDetailModal, {
  NotificationDetail,
} from "@/components/NotificationDetailModal/NotificationDetailModal";
import Notifications from "@/assets/notifications.png";
import ProfileImage from "@/assets/profile-dummy.png";
import StarIcon from "@/assets/star.png";
import { useRouter } from "next/navigation";
import HeaderDropdown from "../HeaderDropdowns";

import { useSession } from "next-auth/react";

const MOCK: NotificationItem[] = [
  {
    id: "1",
    title: "Your Loan request was successful",
    subtitle: "Click to view loan request details",
    createdAt: "3 days ago",
    read: false,
  },
  {
    id: "2",
    title: "Your Loan request was successful",
    subtitle: "Click to view loan request details",
    createdAt: "3 days ago",
    read: true,
  },
];

const quickLinksDropdowns = [
  { label: "Save Now", href: "/dashboard/savings" },
  { label: "Apply for a Loan", href: "/dashboard/loans" },
  { label: "Invest Now", href: "/dashboard/investments" },
  { label: "Withdraw Funds", href: "/dashboard/withdraw" },
];

const profileDropdowns = [
  { label: "My Profile", href: "/dashboard/profile" },
  { label: "Settings", href: "/settings" },
  // {label: "Logout", href: "/logout"},
];

const Header = () => {
  const navRef = useRef<HTMLDivElement>(null);

  const session = useSession();

  const firstName = session.data?.user.firstName;

  const [openList, setOpenList] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState<NotificationDetail | null>(null);
  const [openQuickLinks, setOpenQuickLinks] = useState(false);
  const [openProfileLinks, setOpenProfileLinks] = useState(false);

  const notifications = useMemo(() => MOCK, []);

  const router = useRouter();

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

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenQuickLinks(false);
        setOpenProfileLinks(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const openNotification = (id: string) => {
    setSelectedId(id);
    setData({
      id,
      title: "Loan request successful",
      statusLabel: "Loan request successful",
      statusType: "success",
      dateTime: "Jan 21, 2022 3:45pm",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    });
    setOpenList(false);
    setOpenDetail(true);
  };

  return (
    <div ref={navRef} className={styles.header}>
      <nav className={styles.headerRight}>
        <div
          onClick={(event) => {
            event.stopPropagation();
            setOpenQuickLinks((prev) => !prev);
            setOpenProfileLinks(false);
          }}
          className={styles.quickActionsContainer}
        >
          <Image src={StarIcon} alt="red star icon" />
          <p className={styles.quickActionsText}>Quick actions</p>
        </div>

        <div className={styles.headerRightRight}>
          <button
            className={styles.notificationBtn}
            onClick={() => {
              setOpenQuickLinks(false);
              setOpenProfileLinks(false);
              setOpenList(true);
            }}
            aria-label="Open notifications"
          >
            <Image src={Notifications} alt="Notifications" />
            {notifications.some((n) => !n.read) && (
              <span className={styles.notificationDot} />
            )}
          </button>
          <div
            onClick={(event) => {
              event.stopPropagation();
              setOpenProfileLinks((prev) => !prev);
              setOpenQuickLinks(false);
            }}
            className={styles.profileContainer}
          >
            <Image src={ProfileImage} alt="Profile Image" />
            <p className={styles.profileFirstName}>{firstName}</p>
          </div>
        </div>
      </nav>

      <NotificationsModal
        open={openList}
        onClose={() => setOpenList(false)}
        notifications={notifications}
        onMarkAllRead={() => console.log("mark all read")}
        onOpenNotification={openNotification}
      />

      <NotificationDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        data={data}
      />
      <HeaderDropdown
        isOpen={openQuickLinks}
        Header="Quick Actions"
        navLinks={quickLinksDropdowns}
        rightPos="12rem"
      />
      <HeaderDropdown
        isOpen={openProfileLinks}
        Header="My Account"
        navLinks={profileDropdowns}
      />
    </div>
  );
};

export default Header;
