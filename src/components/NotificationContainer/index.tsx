import React, { ReactNode } from 'react'
import styles from './notificationContainer.module.css'
import Image from 'next/image'

interface NotificationContainerProps {
    message: string | ReactNode;
    amount?: string | ReactNode;
    time: number | ReactNode;
}

const NotificationContainer = ({message, time, amount=''}: NotificationContainerProps) => {
  return (
    <div className={styles.container}>
        <div className={styles.textcontainer}>
            <Image 
                src={'/activityLogo.png'}
                width={30}
                height={30}
                className={styles.activityLogo}
                alt='Paz Logo'
            />
            <div className={styles.messageContainer}>
                <p className={styles.notificationMessage}>{message}</p>
                {
                    amount ? (<p className={styles.notificationAmount}>{amount}</p>) :
                    ('')
                }
            </div>
        </div>
        <p className={styles.date}>{time}</p>
    </div>
  )
}

export default NotificationContainer