"use client";
import { useState } from "react";
import styles from "./sidebar.module.css";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
// import { removeToken } from "@/libs/auth";
// import useUser from "@/store/userStore";
// import { useQueryClient } from "@tanstack/react-query";

import Image, { ImageProps } from "next/image";

import DashboardIcon from "@/assets/dashboard-logo.svg";
import ToggleIcon from "@/assets/toggle-icon.png";
import CompoundLogo from "@/assets/compound-logo.png";
import SavingsIcon from "@/assets/piggy-bank.svg";
import LoansIcon from "@/assets/wallet.svg";
import ThriftIcon from "@/assets/thrift.svg";
import InvestmentsIcon from "@/assets/investments.svg";
import SettingsIcon from "@/assets/settings.svg";
import ProfileImage from "@/assets/profile-dummy.png";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

type OptionProps = {
  active: boolean;
  icon: ImageProps["src"];
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
          <Image alt={alt} src={icon} width={24} height={24} />
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
  icon: ImageProps["src"];
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

  const router = useRouter();

  return (
    <div className={styles.dropdownContainer}>
      <div
        className={clsx(
          styles.optionContainer,
          styles.dropdownTrigger,
          collapsed && styles.optionContainerCollapsed,
        )}
      >
        <div
          className={styles.optionInnerContainer}
          onClick={() => {
            router.push("/dashboard/savings");
          }}
        >
          <Image alt={alt} src={icon} width={24} height={24} />
          {!collapsed && <p className={styles.sidebarOptionText}>Savings</p>}
        </div>
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

export default function Sidebar({
  isOpen,
  collapsed,
  onToggle,
}: {
  isOpen: boolean;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const handleLogout = () => {
    signOut();
  };

  const session = useSession();

  const fullName = `${session?.data?.user?.firstName} ${session?.data?.user?.lastName}`;
  const email = session.data?.user?.email;

  const pathname = usePathname();

  const isSubPath = (path: string, currentPath: string) => {
    return currentPath.includes(path);
  };

  return (
    <aside
      className={clsx(
        styles.sidebarContainer,
        collapsed && styles.sidebarContainerCollapsed,
      )}
    >
      <nav className={styles.sidebar}>
        <div className={styles.topContainer}>
          <div
            className={clsx(
              styles.headingContainer,
              collapsed && styles.headingContainerCollapsed,
            )}
          >
            {!collapsed && <Image src={CompoundLogo} alt="Compound Logo" />}
            <Image
              className={clsx(
                styles.toggleIcon,
                collapsed && styles.toggleIconCollapsed,
              )}
              src={ToggleIcon}
              alt="Toggle Icon"
              onClick={onToggle}
            />
          </div>

          <div className={styles.centreContainer}>
            <SidebarOption
              alt="a four-sectioned square with curved edges"
              icon={DashboardIcon}
              title="Dashboard"
              href="/dashboard"
              active={pathname == "/dashboard"}
              collapsed={collapsed}
            />
            <SavingsDropdown
              alt="piggy bank icon"
              icon={SavingsIcon}
              collapsed={collapsed}
              pathname={pathname}
              subItems={[
                { title: "Solo Savers", href: "/dashboard/savings/solo-saver" },
                {
                  title: "Target Savings",
                  href: "/dashboard/savings/target-savings",
                },
                {
                  title: "Family Vault Saving",
                  href: "/dashboard/savings/family-vault",
                },
              ]}
            />
            <SidebarOption
              alt="a four-sectioned square with curved edges"
              icon={LoansIcon}
              title="Loans"
              href="/dashboard/loans"
              active={isSubPath("/dashboard/loans", pathname)}
              collapsed={collapsed}
            />
            <SidebarOption
              alt="a four-sectioned square with curved edges"
              icon={ThriftIcon}
              title="Thrifts"
              href="/dashboard/thrift"
              active={isSubPath("/dashboard/thrift", pathname)}
              collapsed={collapsed}
            />
            <SidebarOption
              alt="a four-sectioned square with curved edges"
              icon={InvestmentsIcon}
              title="Investments"
              href="/dashboard/investments"
              active={isSubPath("/dashboard/investments", pathname)}
              collapsed={collapsed}
            />
            <SidebarOption
              alt="a four-sectioned square with curved edges"
              icon={SettingsIcon}
              title="Settings"
              href="/settings"
              active={isSubPath("/settings", pathname)}
              collapsed={collapsed}
            />
          </div>
        </div>
        <div
          className={clsx(
            styles.bottomContainer,
            collapsed && styles.bottomContainerCollapsed,
          )}
        >
          <div className={styles.userInfo}>
            <Image
              src={ProfileImage}
              alt="User Avatar"
              width={32}
              height={32}
              className={styles.avatar}
            />
            {!collapsed && (
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
              {!collapsed && "Logout"}
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
