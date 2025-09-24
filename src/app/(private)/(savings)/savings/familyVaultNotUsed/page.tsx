'use client'
import React, {useState} from 'react'
import styles from './familyVault.module.css'
import TotalBalanceCard from '@/components/TotalBalanceCard'
import Image from 'next/image'
import WithdrawModal from '@/components/WithdrawalConsent'

const FamilyVault = () => {
    const families = [
    { name: 'Olowo Family', desc: 'Monthly food saving quota', money: '500000', members: 3, owner: true },
    { name: 'Lekki House Family', desc: 'Rent saving quota', money: '1500000', members: 3 },
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
                families.map((family, idx) => {
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
                            {family.owner ? (
                                <div className={styles.savingsOwner}>
                                    <p>Savings plan owner</p>
                                </div>
                            ): ''}
                            <p>{family.members} <span>members</span></p>
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