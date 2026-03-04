"use client";
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

export default function Sidebar({ 
  isOpen, 
  collapsed, 
  onToggle 
}: { 
  isOpen: boolean; 
  collapsed: boolean; 
  onToggle: () => void;
}) {
  // const qc = useQueryClient();

  // const handleLogout = () => {
  //   removeToken();
  //   qc.resetQueries();
  //   qc.clear();
  //   useUser.persist.clearStorage();
  // };

  const pathname = usePathname();
  const router = useRouter();

  const isSubPath = (path: string, currentPath: string) => {
    return currentPath.includes(path);
  };

  return (
    <aside className={clsx(styles.sidebarContainer, collapsed && styles.sidebarContainerCollapsed)}>
      <nav className={styles.sidebar}>
        <div className={styles.topContainer}>
          <div className={clsx(styles.headingContainer, collapsed && styles.headingContainerCollapsed)}>
            {!collapsed && <Image src={CompoundLogo} alt="Compound Logo" />}
            <Image
              className={clsx(styles.toggleIcon, collapsed && styles.toggleIconCollapsed)}
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
            <SidebarOption
              alt="a four-sectioned square with curved edges"
              icon={SavingsIcon}
              title="Savings"
              href="/dashboard/savings"
              active={isSubPath("/dashboard/savings", pathname)}
              collapsed={collapsed}
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
        <div className={clsx(styles.bottomContainer, collapsed && styles.bottomContainerCollapsed)}>
          <div onClick={()=>{router.push("/dashboard/profile")}} className={styles.userInfo}>
            <Image src={ProfileImage} alt="User Avatar" width={32} height={32} className={styles.avatar} />
            {!collapsed && (
              <div>
                <p className={styles.username}>Esther Williams</p>
                <p className={styles.userEmail}>Esther22@gmail.com</p>
              </div>
            )}
          </div>
          <div>
            <button className={styles.logoutButton}>
              <Image
                src='/images/logout.png'
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
