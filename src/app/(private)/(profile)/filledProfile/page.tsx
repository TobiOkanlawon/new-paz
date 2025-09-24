import React from 'react'
import TextGroup from '@/components/TextGroup'
import Image from 'next/image'
import styles from './filledPage.module.css'

const filledState = () => {
  return (
    <div className={styles.container}>
        
        <header className={styles.header}>
            <Image
                src={'/profileImage.png'}
                alt='Profile Image'
                width={112}
                height={112}
            />
            <p>Biodun Olowo</p>
        </header>
        <main>
            <div>
                <div className={styles.textGroupContainer}>
                    <TextGroup
                        header= {'Postal Address'}
                        texts = {'8, Agbaoku street, Opebi Lagos'}
                    />
                    <TextGroup
                        header= {'Date Of Birth'}
                        texts = {'Jan 1st, 2023'}
                    />
                </div>
                <div className={styles.textGroupContainer}>
                    <TextGroup
                        header= {'Gender'}
                        texts = {'Male'}
                    />
                    <TextGroup
                        header= {'Email'}
                        texts = {'abiodunfromlondon@gmail.com'}
                    />
                </div>
                <div>
                    <TextGroup
                        header= {'Phone Number'}
                        texts = {'0701 234 5678'}
                    />
                </div>
            </div>
            <div>
                <div>
                    <h2>Next Of Kin Details</h2>
                </div>
                <div className={styles.textGroupContainer}>
                    <TextGroup
                        header= {'First Name'}
                        texts = {'Sade'}
                    />
                    <TextGroup
                        header= {'Last Name'}
                        texts = {'Olowo'}
                    />
                </div>
                <div className={styles.textGroupContainer}>
                    <TextGroup
                        header= {'Email'}
                        texts = {'sadeaiyabiodun@gmail.com'}
                    />
                    <TextGroup
                        header= {'Phone Number'}
                        texts = {'0801 234 5678'}
                    />
                </div>
                <div>
                    <TextGroup
                        header= {'Relationship'}
                        texts = {'Spouse'}
                    />
                </div>
            </div>
        </main>
    </div>
  )
}

export default filledState