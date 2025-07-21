import React, { useState } from "react";
import styles from './WithdrawalOptions.module.css'
import { LuClock4, LuClock7 } from "react-icons/lu";
import WithdrawModal from "../WithdrawModal";

interface WithdrawalOptionsProps{
    handlePending: () => void;
    onClose?: () => void;
}

const WithdrawalOptions: React.FC<WithdrawalOptionsProps> = ({handlePending, onClose}) => {
    const [isActive, setIsActive] = useState(false)
    const handleContentSwitch = () => setIsActive(true)
  return (
    <>
        {
            isActive ? (<WithdrawModal/>) : (
                <div className={styles.optionContainer}>
                    <h1>Withdraw your savings</h1>
                    <p>Get funds from your savings by filling the form below</p>
                    <div className={styles.options}>
                        <LuClock4/>
                        <p>Withdraw in 24 hours time</p>
                        <button onClick={() => {handlePending(); onClose?.();}}>Withdraw</button>
                    </div>
                    <div className={styles.options}>
                        <LuClock7/>
                        <p>Pay N2000 Instant withdrawal fine</p>
                        <button onClick={handleContentSwitch}>Withdraw</button>
                    </div>
                </div>
            )
        }
    </>
  )
}

export default WithdrawalOptions