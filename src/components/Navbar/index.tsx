import React from 'react'
import styles from './navbar.module.css'
import Image from 'next/image'
import NotificationDropdown from '@/components/NotificationDropdown'

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({onToggleSidebar}) => {
  return (
    <>
        <nav className={styles.nav}>
            <div className={styles.navContainer}>
                <div className={styles.logoContainer}>
                    <Image 
                        src='/hamburger.png' 
                        alt='Hamburger'
                        width={18}
                        height={22}
                        onClick={onToggleSidebar} 
                        className={styles.hamburger}
                    />
                    <Image
                        src="/PAZLogo.png"
                        alt="Logo"
                        width={87}
                        height={22.61}
                        className={styles.logo}
                    />
                </div>
                <div className={styles.opContainer}>
                    <Image
                        src="/notificationBell.png"
                        alt="Notifications"
                        className={styles.notificationBell}
                        width={16}
                        height={20}
                        />
                    <NotificationDropdown />    
                </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar