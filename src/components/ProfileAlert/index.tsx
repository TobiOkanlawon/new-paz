import React from 'react'
import styles from './profileAlert.module.css'
import Image from 'next/image';

interface ProfileAlertProps {
    isActive: boolean;
    isSuccessful: boolean;
    onClose: () => void;
    alertType: string;
}

const ProfileAlert: React.FC<ProfileAlertProps> = (props: ProfileAlertProps) => {
    return (
        <div className={styles.alertContainer}>
            {props.isActive ? (
                props.isSuccessful ? (
                    <p className={styles.success}>
                        {`Successfully changed ${props.alertType}`}
                        <Image
                            src={'/profileAlertClose.png'}
                            alt={'Profile Alert Close'}
                            width={12}
                            height={12}
                            onClick={props.onClose}
                        />
                    </p>
                ) : (
                    <p className={styles.noSuccess}>
                        {`Error Executing Command`}
                        <Image
                            src={'/profileAlertClose.png'}
                            alt={'Profile Alert Close'}
                            width={12}
                            height={12}
                            onClick={props.onClose}
                        />
                    </p>
                )
            ) : (
                <p>{""}</p>
            )}
        </div>
    )
}

export default ProfileAlert