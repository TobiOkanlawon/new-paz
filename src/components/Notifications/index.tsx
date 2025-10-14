import React from 'react'
import styles from './notification.module.css'
import NotificationContainer from '@/components/NotificationContainer'
import Image from 'next/image'

// ...other imports

interface NotificationItem {
  message: string | React.ReactNode;
  id: number;
  time: string;
  amount?: string;
}

interface NotificationProps {
  header: string;
  notifications?: NotificationItem[];
}

const Notifications: React.FC<NotificationProps> = ({ header, notifications = [] }) => {
    return (
        <div className={styles.container}>
        <h1 className={styles.header}>{header}</h1>
        {
          header === 'Notification' ? (<p className={styles.headerText}>See all your notifications in one place</p>) : null
        }
        <div className={styles.notificationWrapper}>
          { notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationContainer 
                key={notification.id}
                message={notification.message}
                time={notification.time}
                amount={notification.amount || ""}
              />
            ))
          ) : (
            <div className={styles.emptyContainer}>
            <Image
              src={"/noNotification.png"}
              alt="No notification image"
              width={100}
              height={100}
            />
            <p>You have no recent activities yet!</p>
          </div>
          )
          }
        </div>
    </div>
  )
}

export default Notifications