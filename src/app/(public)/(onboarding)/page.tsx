import styles from './onboarding/page.module.css'
import Image from 'next/image'

const Onboarding = () => {
    const keyNotes = [
        { title: 'Easy Setup', description: 'Get started in minutes with our simple onboarding process.', icon: '/images/onboarding1.png', iconBG: '#E5EAFB'},
        { title: 'Secure and Private Authentication', description: 'Enterprise grade security to keep your data safe.', icon: '/images/onboarding21.png', iconBG: '#F9EAD1' },
        { title: 'PAZ Family Savings', description: 'Build meaningful savings as a family, with shared goals and real progress.', icon: '/images/onboarding31.png', iconBG: '#E6FCEE' },
        { title: 'PAZ Loans', description: 'Access loans with confidence, fair rates, clear terms, no stress', icon: '/images/onboarding4.png', iconBG: '#E0DFFD' },
    ]
    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Start your journey with PAZ</h2>
            <p className={styles.subheader}>Join thousands of people already using PAZ for easy payments, secure authentications and daily use.</p>

            <div className={styles.keyNotesContainer}>
                {keyNotes.map((note, index) => (
                    <div key={index} className={styles.noteContainer}>
                        <div className={styles.noteImage} style={{ backgroundColor: note.iconBG }}><Image src={note.icon} alt={note.title} width={26} height={26} /></div>
                        <div className={styles.noteText}>
                            <h3>{note.title}</h3>
                            <p>{note.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Onboarding
