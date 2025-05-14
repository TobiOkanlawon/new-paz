import React from 'react'
import styles from './dashboard.module.css'
import Image from 'next/image' 
import Link from 'next/link' 

const Dashboard = () => {
  return (
    <>
    <div className={styles.container}>        
        <h2 className={styles.h2}>Dashboard</h2>
    </div>
    </>
  )
}

export default Dashboard