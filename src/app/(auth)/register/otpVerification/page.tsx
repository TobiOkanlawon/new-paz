import React from 'react'
import styles from './otpVerify.module.css'
import Link from 'next/link'
import Button from '@/components/Button'
import { FaArrowLeft } from 'react-icons/fa'
import Image from 'next/image'

const otpVerify = () => {
  return (
    <>
      <div className={styles.right}>
        <Image src={'/PAZLogo2.png'} alt="Logo" width={104} height={34.76} className={styles.logo} />
        <h2 className={styles.heading}>Account Verification</h2>
        <p className={styles.text}>Enter OTP code sent to your email below.</p>
        <div className={styles.inputContainer}>
            <input className={styles.inputs} type="text" />
            <input className={styles.inputs} type="text" />
            <input className={styles.inputs} type="text" />
            <input className={styles.inputs} type="text" />
            <input className={styles.inputs} type="text" />
            <input className={styles.inputs} type="text" />
        </div>
        <div className={styles.linkContainer}>
            <Link href="#">Use phone instead</Link>
            <Link href="#">Reset Code</Link>
        </div>
        <Button>Verify Code</Button>
        <Link href="/login" className={styles.returnToLogin}><FaArrowLeft className={styles.arrowLeft}/> Return to Log in </Link>
      </div>
      <div className={styles.mobile}>
        <div className={styles.mobileContainer}>

        </div>
      </div>
    </>
  )
}

export default otpVerify