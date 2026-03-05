import React from 'react'
import styles from './dropdown.module.css'
import Link from "next/link";

interface HeaderDropdownProps {
    isOpen: boolean;
    Header: string;
    navLinks: { label: string; href?: string; functions?: () => void }[];
    rightPos?: string;
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ isOpen, Header, navLinks, rightPos }) => {
  return (
    isOpen && (
      <div style={{right: rightPos}} className={styles.dropdown}>
        <div className={styles.header}>{Header}</div>
        <div className={styles.links}>
          {navLinks.map((link, index) => (
            link.href ? (
              <Link key={index} href={link.href} className={styles.link} onClick={link.functions}>
                {link.label}
              </Link>
            ) : (
              <div key={index} className={styles.link} onClick={link.functions}>
                {link.label}
              </div>
            )
          ))}
        </div>
      </div>
    )
  )
}

export default HeaderDropdown