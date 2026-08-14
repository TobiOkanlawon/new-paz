"use client";
import { useState } from "react";
import styles from "./sidebar.module.css";
import clsx from "clsx";
import { usePathname } from "next/navigation";
// import { removeToken } from "@/libs/auth";
// import useUser from "@/store/userStore";
// import { useQueryClient } from "@tanstack/react-query";

import Image from "next/image";

import DashboardIcon from "@/assets/dashboard-logo.png";
import ToggleIcon from "@/assets/toggle-icon.png";
import CompoundLogo from "@/assets/compound-logo.png";
import Piggy from "@/assets/piggy-bank.png";
import LoansIcon from "@/assets/wallet.png";
import SettingsIcon from "@/assets/settings.png";
import StarIcon from "@/assets/star.png";
import NotificationsIcon from "@/assets/notifications.png";
// import ProfileImage from "@/assets/profile-dummy.png";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import useUser from "@/store/userStore";
import FundWalletFlow from "@/components/ModalFlows/FundWalletFlow";

type OptionProps = {
  active: boolean;
  icon: React.ReactNode;
  href: string;
  title: string;
  alt: string; // the alt tag for the svg
  collapsed?: boolean;
};

const SidebarOption: React.FC<OptionProps> = ({
  active,
  alt,
  icon,
  title,
  href,
  collapsed = false,
}) => {
  return (
    <Link className={styles.navLink} href={href}>
      <div
        className={clsx(
          styles.optionContainer,
          active && styles.activeOptionContainer,
          collapsed && styles.optionContainerCollapsed,
        )}
      >
        <div className={styles.optionInnerContainer}>
          {icon}
          {!collapsed && (
            <p
              className={clsx(
                styles.sidebarOptionText,
                active && styles.sidebarOptionTextActive,
              )}
            >
              {title}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

type SubItem = {
  title: string;
  href: string;
};

type SavingsDropdownProps = {
  icon: React.ReactNode;
  alt: string;
  collapsed: boolean;
  pathname: string;
  subItems: SubItem[];
};

const SavingsDropdown: React.FC<SavingsDropdownProps> = ({
  icon,
  alt,
  collapsed,
  pathname,
  subItems,
}) => {
  const isInSavingsSection = pathname.includes("/dashboard/savings");
  const [isOpen, setIsOpen] = useState(isInSavingsSection);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdownContainer}>
      <div
        className={clsx(
          styles.optionContainer,
          styles.dropdownTrigger,
          collapsed && styles.optionContainerCollapsed,
        )}
      >
        <Link className={styles.optionInnerContainer} href="/dashboard/savings">
          {icon}
          {!collapsed && <p className={styles.sidebarOptionText}>Savings</p>}
        </Link>
        {!collapsed && (
          <svg
            onClick={handleToggle}
            className={clsx(styles.chevron, isOpen && styles.chevronOpen)}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="#2E2E2E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {!collapsed && isOpen && (
        <div className={styles.subItemsContainer}>
          {subItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                <div
                  className={clsx(
                    styles.subItem,
                    isActive && styles.subItemActive,
                  )}
                >
                  <p
                    className={clsx(
                      styles.subItemText,
                      isActive && styles.subItemTextActive,
                    )}
                  >
                    {item.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

type QuickActionItem =
  | { title: string; href: string }
  | { title: string; action: () => void };

const SidebarQuickActions: React.FC<{ collapsed: boolean }> = ({
  collapsed,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FundWalletFlow>
      {(openFundWalletModal) => {
        const quickActionLinks: QuickActionItem[] = [
          { title: "Save Now", href: "/dashboard/savings" },
          { title: "Apply for a Loan", href: "/dashboard/loans" },
          {
            title: "Fund Wallet",
            action: () => {
              setIsOpen(false);
              openFundWalletModal();
            },
          },
          { title: "Withdraw Funds", href: "/dashboard/withdraw" },
        ];

        return (
          <div className={styles.dropdownContainer}>
            <div
              className={clsx(
                styles.optionContainer,
                styles.dropdownTrigger,
                collapsed && styles.optionContainerCollapsed,
              )}
              onClick={() => setIsOpen((p) => !p)}
            >
              <div className={styles.optionInnerContainer}>
                <Image
                  src={StarIcon}
                  alt="Quick actions"
                  className={styles.sidebarIcon}
                  width={24}
                  height={24}
                />
                {!collapsed && (
                  <p className={styles.sidebarOptionText}>Quick actions</p>
                )}
              </div>
              {!collapsed && (
                <svg
                  className={clsx(styles.chevron, isOpen && styles.chevronOpen)}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="#2E2E2E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            {!collapsed && isOpen && (
              <div className={styles.subItemsContainer}>
                {quickActionLinks.map((item) =>
                  "href" in item ? (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={styles.navLink}
                    >
                      <div className={styles.subItem}>
                        <p className={styles.subItemText}>{item.title}</p>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={item.title}
                      className={styles.navLink}
                      onClick={item.action}
                    >
                      <div className={styles.subItem}>
                        <p className={styles.subItemText}>{item.title}</p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        );
      }}
    </FundWalletFlow>
  );
};

export default function Sidebar({
  isOpen,
  collapsed,
  action,
  mobileOpen = false,
  onMobileClose,
}: {
  isOpen: boolean;
  collapsed: boolean;
  action: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const handleLogout = async () => {
    // Dispatch logout event to trigger client-side cleanup
    window.dispatchEvent(new Event("logout"));
    // Then call signOut which will redirect to logout endpoint
    await signOut({ callbackUrl: "/api/auth/logout", redirect: true });
  };

  const session = useSession();
  const profileImage = useUser((state) => state.profileImage);

  const fullName = `${session?.data?.user?.firstName} ${session?.data?.user?.lastName}`;
  const email = session.data?.user?.email;

  const pathname = usePathname();
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  const isSubPath = (path: string, currentPath: string) => {
    return currentPath.includes(path);
  };

  // On mobile the sidebar defaults to collapsed, but when it's open text must show
  const isActuallyCollapsed = collapsed && !mobileOpen;

  return (
    <aside
      className={clsx(
        styles.sidebarContainer,
        collapsed && styles.sidebarContainerCollapsed,
        mobileOpen && styles.mobileSidebarOpen,
      )}
    >
      <nav className={styles.sidebar}>
        <div className={styles.topContainer}>
          {/* Mobile close button */}
          <button
            className={styles.mobileCloseBtn}
            onClick={onMobileClose}
            aria-label="Close menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Desktop heading */}
          <div
            className={clsx(
              styles.headingContainer,
              isActuallyCollapsed && styles.headingContainerCollapsed,
            )}
          >
            {!isActuallyCollapsed && (
              <Image src={CompoundLogo} alt="Compound Logo" />
            )}
            <Image
              className={clsx(
                styles.toggleIcon,
                isActuallyCollapsed && styles.toggleIconCollapsed,
              )}
              src={ToggleIcon}
              alt="Toggle Icon"
              onClick={action}
            />
          </div>

          <div className={styles.centreContainer}>
            <SidebarOption
              alt="a four-sectioned square with curved edges"
              icon={
                <Image
                  src={DashboardIcon}
                  alt="Dashboard"
                  className={styles.sidebarIcon}
                  width={24}
                  height={24}
                />
              }
              title="Dashboard"
              href="/dashboard"
              active={pathname == "/dashboard"}
              collapsed={isActuallyCollapsed}
            />
            <SavingsDropdown
              alt="piggy bank icon"
              icon={
                <Image
                  src={Piggy}
                  alt="Savings"
                  className={styles.sidebarIcon}
                  width={24}
                  height={24}
                />
              }
              collapsed={isActuallyCollapsed}
              pathname={pathname}
              subItems={[
                { title: "Solo Savers", href: "/dashboard/savings/solo-saver" },
                {
                  title: "Target Savings",
                  href: "/dashboard/savings/target-savings",
                },
                { title: "Savings Plan", href: "/dashboard/savings/create" },
              ]}
            />
            <SidebarOption
              alt="a four-sectioned square with curved edges"
              icon={
                <Image
                  src={LoansIcon}
                  alt="Loans"
                  className={styles.sidebarIcon}
                  width={24}
                  height={24}
                />
              }
              title="Loans"
              href="/dashboard/loans"
              active={isSubPath("/dashboard/loans", pathname)}
              collapsed={isActuallyCollapsed}
            />
            <SidebarOption
              alt="a four-sectioned square with curved edges"
              icon={
                <Image
                  src={SettingsIcon}
                  alt="Settings"
                  className={styles.sidebarIcon}
                  width={24}
                  height={24}
                />
              }
              title="Settings"
              href="/dashboard/settings"
              active={isSubPath("/dashboard/settings", pathname)}
              collapsed={isActuallyCollapsed}
            />
            <div className={styles.mobileOnly}>
              <SidebarQuickActions collapsed={isActuallyCollapsed} />
            </div>
          </div>
        </div>
        {/* Desktop bottom — avatar + name + email + logout */}
        <div
          className={clsx(
            styles.bottomContainer,
            styles.desktopOnly,
            isActuallyCollapsed && styles.bottomContainerCollapsed,
          )}
        >
          <div className={styles.userInfo}>
            <Image
              src={profileImage}
              alt="User Avatar"
              width={32}
              height={32}
              className={styles.avatar}
            />
            {!isActuallyCollapsed && (
              <div>
                <p className={styles.username}>{fullName}</p>
                <p className={styles.userEmail}>{email}</p>
              </div>
            )}
          </div>
          <div>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <Image
                src="/images/logout.png"
                alt="Logout Icon"
                width={20}
                height={20}
              />
              {!isActuallyCollapsed && "Logout"}
            </button>
          </div>
        </div>

        {/* Mobile bottom — bell + avatar/name/email dropdown trigger */}
        <div className={styles.mobileBottomSection}>
          <button className={styles.mobileBellBtn} aria-label="Notifications">
            <Image
              src={NotificationsIcon}
              alt="Notifications"
              width={22}
              height={22}
            />
          </button>

          <div
            className={styles.mobileProfileTrigger}
            onClick={() => setMobileProfileOpen((p) => !p)}
          >
            <Image
              src={profileImage}
              alt="User Avatar"
              width={32}
              height={32}
              className={styles.avatar}
            />
            <div className={styles.mobileProfileInfo}>
              <p className={styles.mobileProfileName}>{fullName}</p>
              <p className={styles.mobileProfileEmail}>{email}</p>
            </div>
            <svg
              className={clsx(
                styles.chevron,
                mobileProfileOpen && styles.chevronOpen,
              )}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {mobileProfileOpen && (
            <div className={styles.mobileProfileDropdown}>
              <Link
                href="/dashboard/profile"
                className={styles.mobileProfileDropdownItem}
              >
                My Profile
              </Link>
              <button
                className={styles.mobileProfileDropdownItem}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
