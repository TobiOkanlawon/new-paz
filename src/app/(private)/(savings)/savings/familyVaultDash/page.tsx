'use client'
import React, {useState} from 'react'
import styles from './familyVault.module.css'
import TotalBalanceCard from '@/components/TotalBalanceCard'
import Image from 'next/image'
import WithdrawModal from '@/components/WithdrawalConsent'
import Back from '@/components/BackContainer'
import FamilyCard from '@/components/FamilyCard'

const FamilyVault = () => {
    const families = [
    { name: 'Olowo Family', desc: 'Monthly food saving quota', money: '500000', members: 3, owner: true },
    { name: 'Lekki House Family', desc: 'Rent saving quota', money: '1500000', members: 3 },
    { name: 'Olowo Family', desc: 'Monthly food saving quota', money: '500000', members: 3, owner: true },
    { name: 'Lekki House Family', desc: 'Rent saving quota', money: '1500000', members: 3 },
    { name: 'Olowo Family', desc: 'Monthly food saving quota', money: '500000', members: 3, owner: true },
    { name: 'Lekki House Family', desc: 'Rent saving quota', money: '1500000', members: 3 },
  ]
const [showMoney, setShowMoney] = useState(true);
const handleToggle = () => setShowMoney((prev) => !prev);
  return (
    <div className={styles.container}>
        <Back/>
        <h2 className={styles.header}>PAZ Family Vault</h2>
        <p className={styles.headingText}>Explore all our savings plans here.</p>

        <TotalBalanceCard header='Total savings balance' money={2000000} />

        <FamilyCard Families={families}/>
    </div>
  )
}

export default FamilyVault