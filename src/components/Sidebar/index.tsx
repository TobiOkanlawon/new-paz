import Image from 'next/image';
import Link from 'next/link';
import styles from './sidebar.module.css';
import clsx from 'clsx';

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside className={clsx(styles.sidebar, !isOpen && styles.collapsed)}>
      <div className={styles.sidebarContainer}>
        <h3>Welcome Biodun</h3>
        <Link href="/" className={styles.sidebarContent}>
            <Image
                src="/sidebarHome.png"
                alt="Home"
                width={24}
                height={24}
            />
            <p>Home</p>
        </Link>
        <Link href="/" className={styles.sidebarContent}>
            <Image
                src="/sidebarProfile.png"
                alt="Home"
                width={24}
                height={24}
            />
            <p>Profile</p>
        </Link>
        <Link href="/" className={styles.sidebarContent}>
            <Image
                src="/sidebarSavings.png"
                alt="Home"
                width={24}
                height={24}
            />
            <p>Savings</p>
        </Link>
        <Link href="/" className={styles.sidebarContent}>
            <Image
                src="/sidebarLoan.png"
                alt="Home"
                width={24}
                height={24}
            />
            <p>Loan</p>
        </Link>
        <Link href="/" className={styles.sidebarContent}>
            <Image
                src="/sidebarInvestment.png"
                alt="Home"
                width={24}
                height={24}
            />
            <p>Investments</p>
        </Link>
        <Link href="/" className={styles.sidebarContent}>
            <Image
                src="/sidebarThrift.png"
                alt="Home"
                width={24}
                height={24}
            />
            <p>Thrift</p>
        </Link>
         <Link href="/" className={styles.logout}>
          <Image src="/sidebarLogout.png" alt="Logout" width={24} height={24} />
          <p>Logout</p>
        </Link>
      </div>
    </aside>
  );
}
