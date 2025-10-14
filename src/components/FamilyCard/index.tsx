'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './familycard.module.css'

interface Family {
    name: string;
    desc: string;
    money: string | number;
    owner?: boolean;
    members: number;
    url: string; //I think this is meant to be the wallet ID, so that you'll use searchParams yh?
}

interface FamilyCardProp {
    Families: Family[]
}

const FamilyCard: React.FC<FamilyCardProp> = ({Families}) => {
  const router = useRouter()

  const handleCardClick = (url: string) => {
    router.push(url)
  }

  return (
    <div className={styles.cardContainer}>
        {
            Families.map((family, idx) => {
            const moneyValue = family.money && !isNaN(Number(family.money)) ? Number(family.money) : 0;
            return (
                <div 
                    className={styles.cardConainer} 
                    key={idx}
                    onClick={() => handleCardClick(family.url)}
                >
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
  )
}

export default FamilyCard