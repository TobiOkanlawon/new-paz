import Image from "next/image";
import Link from "next/link";
import styles from "./sidebar.module.css";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { removeToken } from "@/libs/auth";
import useUser from "@/store/userStore";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const { user } = useUser();

  const handleLogout = () => {
    removeToken();
  };

  const pathname = usePathname();
  const links = [
    { href: "/dashboard", icon: "/sidebarHome.png", label: "Home" },
    { href: "/profile", icon: "/sidebarProfile.png", label: "Profile" },
    { href: "/savings", icon: "/sidebarSavings.png", label: "Savings" },
    { href: "/loans", icon: "/sidebarLoan.png", label: "Loans" },
    {
      href: "/investments",
      icon: "/sidebarInvestment.png",
      label: "Investments",
    },
    { href: "/thrift", icon: "/sidebarThrift.png", label: "Thrift" },
  ];
  return (
    <aside className={clsx(styles.sidebar, !isOpen && styles.collapsed)}>
      <div className={styles.sidebarContainer}>
        <h3>Welcome {user?.first_name}</h3>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              styles.sidebarContent,
              pathname === link.href && styles.active,
            )}
          >
            <Image src={link.icon} alt={link.label} width={24} height={24} />
            <p>{link.label}</p>
          </Link>
        ))}
        <Link onClick={handleLogout} href="/" className={styles.logout}>
          <Image src="/sidebarLogout.png" alt="Logout" width={24} height={24} />
          <p>Logout</p>
        </Link>
      </div>
    </aside>
  );
}
