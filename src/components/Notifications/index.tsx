import React from 'react'
import styles from './notification.module.css'
import NotificationContainer from '@/components/NotificationContainer'
import Image from 'next/image'

// ...other imports

type NotificationProps = {
  header: string;
  notifications?: {
    message: string | React.ReactNode;
    id: number;
    time: string;
    amount?: string;
  }[];
  // other props if any
};

// ...rest of the component
const Notifications: React.FC<NotificationProps>  = ({header, notifications}) => {
    const Notifications = [
        { message: 'PAZ saver account created', id: 1, time: '2:45pm' },
        { message: 'Money saved into PAZ saver', id: 2, amount: 'N 50,000', time: '2 days ago' },
        { message: (
            <>
            Money withdrawal lock period exceeded. You can{' '}
            <a href="#" className={styles.link}>re-lock</a>
            {' '}again if you wish
            </>
        ),
        id: 3,
        time: '2 days ago'
        },
        { message: 'Money withdrawn from savings', amount: 'N 50,000', id: 4, time: '2 days ago' }
    ]
    return (
        <div>
        <h1 className={styles.header}>{header}</h1>
        {
          header === 'Notification' ? (<p className={styles.headerText}>See all your notifications in one place</p>) : null
        }
        <div className={styles.notificationWrapper}>
          { Notifications.length > 0 ? (
            Notifications.map((notification) => (
              <NotificationContainer 
                key={notification.id}
                message={notification.message}
                time={notification.time}
                amount={notification.amount? notification.amount:""}
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