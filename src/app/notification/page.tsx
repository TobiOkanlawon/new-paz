import React from 'react'
import styles from './notification.module.css'
import Image from 'next/image'
import NotificationContainer from '@/components/NotificationContainer'

const Notification = () => {
  const Notifications = [
    { message: 'PAZ saver account created', id: 1, time: '2:45pm' },
    { message: 'Money saved into PAZ saver', id: 2, amount: 'N 50,000', time: '2 days ago' },
    {
      message: (
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
    <div className={styles.container}>
        <div className={styles.backContainer}>
            <Image
                src={'/ArrowLeft.png'}
                className={styles.arrowBack}
                width={24}
                height={24}
                alt='Arrow Back'
            />
            <p>Back</p>
        </div>
        <h1 className={styles.header}>Notification</h1>
        <p className={styles.headerText}>See all your notifications in one place</p>
        <div className={styles.notificationWrapper}>
          {
            Notifications.map((notification) => (
              <NotificationContainer 
                key={notification.id}
                message={notification.message}
                time={notification.time}
                amount={notification.amount? notification.amount:""}
              />
            ))
          }
        </div>
    </div>
  )
}

export default Notification