import React from 'react'
import styles from './Text.module.css'


interface TextGroupProps {
    header: React.ReactNode;
    texts: React.ReactNode;
}

const TextGroup: React.FC<TextGroupProps> = (props) => {
    return (
        <>
            <div className={styles.textContainer}>
                <h4 className={styles.header}>{props.header}</h4>
                <p className={styles.texts}>{props.texts}</p>
            </div>
        </>
    )
}

export default TextGroup