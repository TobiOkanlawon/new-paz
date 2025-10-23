'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './familycard.module.css'

// interface Family {
//     name: string;
//     desc: string;
//     money: string | number;
//     owner?: boolean;
//     members: number;
//     url?: string; //I think this is meant to be the wallet ID, so that you'll use searchParams yh?
// }

interface Family {
    title: string;
    description: string;
    targetAmount: number;
    amount: number;
    accountNo: string;
    owner?: boolean;
    members?: number;
    url?: string
}

interface FamilyCardProp {
    Families: Family[]
}

// Title: "test";
  // accountNo: "9728906907";
  // amount: 0;
  // description: "The author addresses such theological questions as What is God like? Why pray? Male and female-how are we related? How do people see Jesus? What is the shape of the godly life? If the Lord is with us, why do we suffer? How do we face death? through short meditations, each staring with a Bible verse and ending with a brief prayer.";
  // targetAmount: 100000;
  // title: "test";

const FamilyCard: React.FC<FamilyCardProp> = ({Families}) => {
  const router = useRouter()

  const handleCardClick = (url: string | '/') => { //I am not sure of what I did here
    router.push(url)
  }

  return (
    <div className={styles.cardContainer}>
        {
            Families.map((family, idx) => {
            const moneyValue = family.amount && !isNaN(Number(family.amount)) ? Number(family.amount) : 0;
            return (
                <div 
                    className={styles.cardConainer} 
                    key={idx}
                    onClick={() => handleCardClick(family.url || '/')}
                >
                    <h2>{family.title}</h2>
                    <p>{family.description}</p>
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