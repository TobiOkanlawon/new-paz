'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './targetcard.module.css'
import ProgressBar from '@/components/ProgressBar2';

interface TargetCardProp{
    targetCards: Array<{
        name: string;
        desc: string;
        money: number | string;
        percent: number;
    }>
}

const TargetCard: React.FC<TargetCardProp> = ({targetCards}) => {
  const router = useRouter()

  const handleCardClick = (url: string) => {
    router.push(url)
  }

  return (
    <div className={styles.cardContainer}>
            {
                targetCards.map((family, idx) => {
                // Parse money as number, fallback to 0 if invalid
                const moneyValue = family.money && !isNaN(Number(family.money)) ? Number(family.money) : 0;
                return (
                    <div 
                        className={styles.cardConainer} 
                        key={idx}
                        // onClick={() => handleCardClick(family.url)}
                    >
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
  )
}

export default TargetCard