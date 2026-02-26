"use client";
import styles from "./sidebar.module.css";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { removeToken } from "@/libs/auth";
import useUser from "@/store/userStore";
import { useQueryClient } from "@tanstack/react-query";

import Image, { ImageProps } from "next/image";
import DashboardIcon from "@/assets/dashboard-logo.svg";
import Link from "next/link";

type OptionProps = {
  active: boolean;
  icon: ImageProps["src"];
  href: string;
  title: string;
  alt: string; // the alt tag for the svg
};

const SidebarOption: React.FC<OptionProps> = ({
  active,
  alt,
  icon,
  title,
  href,
}) => {
  return (
    <div
      className={clsx(
        styles.optionContainer,
        active && styles.activeOptionContainer,
      )}
    >
      <div className={styles.optionInnerContainer}>
        <Image alt={alt} src={icon} />
        <Link href={href}>{title}</Link>
      </div>
    </div>
  );
};

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  // const qc = useQueryClient();

  // const handleLogout = () => {
  //   removeToken();
  //   qc.resetQueries();
  //   qc.clear();
  //   useUser.persist.clearStorage();
  // };

  const pathname = usePathname();

  const isSubPath = (path: string, currentPath: string) => {
    return currentPath.includes(path);
  };

  return (
    <aside className={styles.sidebarContainer}>
      <nav>
        <div className={styles.headingContainer}>
          {/* This is where the PAZ logo, name and sidebar toggle icon go */}
        </div>

        <div className={styles.centreContainer}>
          <SidebarOption
            alt="a four-sectioned square with curved edges"
            icon={DashboardIcon}
            title="Dashboard"
            href="/dashboard"
            active={pathname == "/dashboard"}
          />
          <SidebarOption
            alt="a four-sectioned square with curved edges"
            icon={DashboardIcon}
            title="Savings"
            href="/savings"
            active={isSubPath("/savings", pathname)}
          />
          <SidebarOption
            alt="a four-sectioned square with curved edges"
            icon={DashboardIcon}
            title="Loans"
            href="/loans"
            active={isSubPath("/loans", pathname)}
          />
          <SidebarOption
            alt="a four-sectioned square with curved edges"
            icon={DashboardIcon}
            title="Thrifts"
            href="/thrift"
            active={isSubPath("/thrift", pathname)}
          />
          <SidebarOption
            alt="a four-sectioned square with curved edges"
            icon={DashboardIcon}
            title="Investments"
            href="/investments"
            active={isSubPath("/investments", pathname)}
          />
          <SidebarOption
            alt="a four-sectioned square with curved edges"
            icon={DashboardIcon}
            title="Settings"
            href="/settings"
            active={pathname == "/settings"}
          />
        </div>
      </nav>
    </aside>
  );
}
