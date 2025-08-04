import React from 'react'
import styles from './notification.module.css'
import Notifications from '@/components/Notifications'
import Back from '@/components/BackContainer'

const Notification = () => {
    const notifications = [
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
        <Back />
        <Notifications header="Notification" notifications={notifications} />
    </div>
  )
}

export default Notification