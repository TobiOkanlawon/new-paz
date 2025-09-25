'use client'
import React from 'react'
import styles from './setting.module.css'
import Image from 'next/image'
import { useState } from 'react'
import {useRouter} from 'next/navigation'

const Setting = () => {
    const [enabled, setEnabled] = useState(false);
    const [toggled, setToggled] = useState(false)
    const router = useRouter()
  return (
    <div className={styles.container}>
        <div onClick={() =>{
            router.back()
        }} className={styles.backContainer}>
            <Image
                src={'/ArrowLeft.png'}
                className={styles.arrowBack}
                width={24}
                height={24}
                alt='Arrow Back'
            />
            <p>Back</p>
        </div>
        <h1 className={styles.header}>Settings</h1>
        <p className={styles.headerText}>Get your account concerns sorted in one place</p>
        <div className={styles.toggleButtons}>
            <button onClick={() => setEnabled(false)} className={`${styles.customerSupport} ${enabled? '':styles.active }`}>Account Settings</button>
            <button onClick={() => setEnabled(true)} className={`${styles.customerSupport} ${enabled? styles.active:""}`}>Customer Support</button>
            </div>
        {
            enabled ? (
                <>
                    <div className={styles.contactSupport}>
                        <h2>Customer Care Line</h2>
                        <a href='tel:09044223377'>0904 422 3377</a>
                    </div>
                    <div className={styles.contactSupport}>
                        <h2>Send us a mail</h2>
                        <a href="mailto:inquiry@mypazfinance.com">inquiry@mypazfinance.com</a>
                    </div>
                </>
            ) : (<div>
            <div className={styles.setPassword}>
                <div className={styles.sPTexts}>
                    <h3>Set Password</h3>
                    <p>You can change your password here in case of a security issue.</p>
                </div>
                <button>Change Password</button>
            </div>
            <div className={styles.setOtp}>
                <div className={styles.otpTexts}>
                    <h3>OTP authentication</h3>
                    <p>Receive a six digit code by text message to confirm it is you when next you log into your account</p>
                </div>
                <label className={styles.toggleSwitch}>
                    <span>Enable</span>
                    <input type="checkbox" checked={toggled} onChange={() => setToggled(prev => !prev)} />
                    <span className={styles.slider} />
                </label>
            </div>
            <div className={styles.sQ}>
                <div className={styles.sQTexts}>
                    <h3>Security question</h3>
                    <p>Answer a question you choose to confirm it’s you.</p>
                </div>
                <button>Set Questions</button>
            </div>
        </div>)
        }
    </div>
  )
}

export default Setting