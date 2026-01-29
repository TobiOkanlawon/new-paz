"use client";
import {useState, useCallback} from "react";
import Image from "next/image";
import styles from './LeftStyle.module.css';
import LeftText from "./LeftText";

const LeftCaurosel = () => {
    const bgImages = [
        {bg: "/images/leftBG1.png", text: "PAZ is a simple and secure platform that helps people save smarter and manage payments with ease. It is built for everyday users who want clarity, control, and peace of mind when handling their money."},
        {bg: "/images/leftBG2.png", text: "With PAZ, users can create an account in minutes, verify their identity seamlessly and start saving and making withdrawal without unnecessary complexity. Every feature is designed to feel intuitive, fast and trustworthy."},
        {bg: "/images/leftBG3.png", text: "PAZ is a simple and secure platform that helps people save smarter and manage payments with ease. It is built for everyday users who want clarity, control, and peace of mind when handling their money."},
    ]

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToNext = useCallback(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, [bgImages.length]);

    const goToPrev = useCallback(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + bgImages.length) % bgImages.length);
    }, [bgImages.length]);

    return (
        <div className={styles.container}>
            <Image src={bgImages[currentImageIndex].bg} alt="Background Image" fill style={{ objectFit: "cover" }} className={styles.bgImages}/>
            <div className={styles.overlay}></div>
            <Image src="/images/pazLeftBG.png" alt="PAZ Logo" width={700} height={237.01} className={styles.logo}/>
            <div className={styles.content}>
                <LeftText 
                    text={bgImages[currentImageIndex].text}
                    currentIndex={currentImageIndex}
                    totalSlides={bgImages.length}
                    onNext={goToNext}
                    onPrev={goToPrev}
                />
            </div>
        </div>
    );
}

export default LeftCaurosel