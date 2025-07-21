import React from 'react'
import styles from './savingsAlert.module.css'
import Image from 'next/image';

interface SavingsAlertProps {
    isActive: boolean;
    isSuccessful: boolean;
    onClose: () => void;
    message: string;
}

const SavingsAlert: React.FC<SavingsAlertProps> = (props: SavingsAlertProps) => {
    return (
        <div className={styles.alertContainer}>
            {props.isActive ? (
                props.isSuccessful ? (
                    <p className={styles.success}>
                        {`${props.message}`}
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

export default SavingsAlert