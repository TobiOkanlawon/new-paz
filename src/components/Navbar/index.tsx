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
        <nav>
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
                        width={127}
                        height={42.61}
                        className={styles.logo}
                    />
                </div>
                <div className={styles.opContainer}>
                    <NotificationDropdown />
                    <div className={styles.userContainer}>
                        <Image
                            src="/defaultDP.png"
                            alt="User"
                            width={40}
                            height={40}
                            className="cursor-pointer"
                        />
                        <Image
                            src="/userDropdown.png"
                            alt="Arrow"
                            width={12}
                            height={6}
                            className="cursor-pointer"
                        />
                    </div>    
                </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar