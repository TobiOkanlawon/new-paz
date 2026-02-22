import styles from "./resetSucess.module.css"
import Image from "next/image"
import Button from "../Button"

const ResetSuccess = () => {
  return (
    <div className={styles.container}>
        <div className={styles.overlay}></div>
        <div className={styles.successContent}>
            <Image src="/images/success.png" alt="Success" width={55} height={55} className={styles.successIcon} />
            <h2 className={styles.header}>You’re all set!</h2>
            <p className={styles.text}>Your password has been updated successfully</p>
            <Button className={styles.button}>Continue to Home</Button>
        </div>
    </div>
  )
}

export default ResetSuccess