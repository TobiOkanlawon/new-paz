'use client'
import React, {useState} from 'react'
import styles from './targetSavings.module.css'
import TotalBalanceCard from '@/components/TotalBalanceCard'
import TargetCard from '@/components/TargetCard'
import Back from '@/components/BackContainer'

const FamilyVault = () => {
    const targetCards = [
    { name: 'Project New Car', desc: 'I must buy Camaro', money: '500000', percent: 5 },
    { name: 'House Rent Runs', desc: 'Rent saving quota', money: '1500000', percent: 70 },
    { name: 'Project New Car', desc: 'I must buy Camaro', money: '500000', percent: 5 },
    { name: 'House Rent Runs', desc: 'Rent saving quota', money: '1500000', percent: 70 },
    { name: 'Project New Car', desc: 'I must buy Camaro', money: '500000', percent: 5 },
    { name: 'House Rent Runs', desc: 'Rent saving quota', money: '1500000', percent: 70 },
  ]
const [showMoney, setShowMoney] = useState(true);
const handleToggle = () => setShowMoney((prev) => !prev);
  return (
    <div className={styles.container}>
        <Back />
        <h2 className={styles.header}>PAZ Family Vault</h2>
        <p className={styles.headingText}>Explore all our savings plans here.</p>

        <TotalBalanceCard header='Total savings balance' money={2000000} />

        <TargetCard targetCards={targetCards} />
    </div>
  )
}

export default FamilyVault