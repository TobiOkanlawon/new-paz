'use client'
import React, {useState} from 'react'
import styles from './targetSavings.module.css'
import TotalBalanceCard from '@/components/TotalBalanceCard'
import ProgressBar from '@/components/ProgressBar2';

const FamilyVault = () => {
    const targetCards = [
    { name: 'Project New Car', desc: 'I must buy Camaro', money: '500000', percent: 5 },
    { name: 'House Rent Runs', desc: 'Rent saving quota', money: '1500000', percent: 70 },
  ]
const [showMoney, setShowMoney] = useState(true);
const handleToggle = () => setShowMoney((prev) => !prev);
  return (
    <div className={styles.container}>
        <h2 className={styles.header}>PAZ Family Vault</h2>
        <p className={styles.headingText}>Explore all our savings plans here.</p>

        <TotalBalanceCard header='Total savings balance' money={2000000} />

        <div className={styles.cardContainer}>
            {
                targetCards.map((family, idx) => {
                // Parse money as number, fallback to 0 if invalid
                const moneyValue = family.money && !isNaN(Number(family.money)) ? Number(family.money) : 0;
                return (
                    <div className={styles.cardConainer} key={idx}>
                        <h2>{family.name}</h2>
                        <p>{family.desc}</p>
                        <h3>
                            ₦ {moneyValue.toLocaleString()}{' '}
                        </h3>
                        <div className={styles.cardBottom}>
                            <ProgressBar percentage={family.percent} />
                        </div>
                    </div>
                )
                })
            }
        </div>

    </div>
  )
}

export default FamilyVault