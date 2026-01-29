import styles from './LeftText.module.css';
import Image from 'next/image';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Button from '../Button';

type LeftTextProps = {
    text: string;
    currentIndex: number;
    totalSlides: number;
    onNext: () => void;
    onPrev: () => void;
};

export default function LeftText({ text, currentIndex, totalSlides, onNext, onPrev }: LeftTextProps) {
    return (
        <div className={styles.container}>
            <div className={styles.textContainer} style={{ backdropFilter: "blur(20px)" }}>
                <Image src="/images/pazLogo.png" className={styles.logo} alt="Paz Logo" width={159} height={54} />
                <p className={styles.text}>{text}</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.skipButton}>Skip</button>
                    <button className={styles.nextButton} onClick={onNext}>Next <FaArrowRight /></button>
                </div>
            </div>
            <div className={styles.indicatorContainer}>
                <FaChevronLeft className={styles.chevronIcon} onClick={onPrev} style={{ cursor: 'pointer' }} />
                <div className={styles.indicatorsContainer}>
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <span 
                            key={index} 
                            className={`${styles.indicator} ${currentIndex === index ? styles.indicatorActive : ''}`}
                        ></span>
                    ))}
                </div>
                <FaChevronRight className={styles.chevronIcon} onClick={onNext} style={{ cursor: 'pointer' }} />
            </div>
            <div className={styles.getStartedContainer}>
                <div className={styles.getStartedButton}>
                    <Button variant="secondary">
                        Login
                    </Button>
                </div>
            </div>
        </div>
    )
}