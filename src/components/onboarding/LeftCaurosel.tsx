"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import styles from './LeftStyle.module.css';
import LeftText from "./LeftText";

const SLIDE_DURATION = 6000; // 5 seconds per slide

const LeftCaurosel = () => {
    const bgImages = [
        { bg: "/images/leftBG1.png", text: "PAZ is a simple and secure platform that helps people save smarter and manage payments with ease. It is built for everyday users who want clarity, control, and peace of mind when handling their money." },
        { bg: "/images/leftBG2.png", text: "With PAZ, users can create an account in minutes, verify their identity seamlessly and start saving and making withdrawal without unnecessary complexity. Every feature is designed to feel intuitive, fast and trustworthy." },
        { bg: "/images/leftBG3.png", text: "PAZ is a simple and secure platform that helps people save smarter and manage payments with ease. It is built for everyday users who want clarity, control, and peace of mind when handling their money." },
    ]

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (!isAutoPlaying) return;

        if (currentImageIndex >= bgImages.length - 1) {
            setIsAutoPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentImageIndex((prev) => prev + 1);
            setAnimationKey((prev) => prev + 1);
        }, SLIDE_DURATION);

        return () => clearTimeout(timer);
    }, [currentImageIndex, isAutoPlaying]);


    const goToNext = useCallback(() => {
        if (currentImageIndex < bgImages.length - 1) {
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => prevIndex + 1);
                setAnimationKey((prev) => prev + 1);
                setIsAutoPlaying(currentImageIndex + 1 < bgImages.length - 1);
            }, 30);
        }
    }, [bgImages.length, currentImageIndex]);

    const goToPrev = useCallback(() => {
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + bgImages.length) % bgImages.length);
            setAnimationKey((prev) => prev + 1);
            setIsAutoPlaying(true);
        }, 300);
    }, [bgImages.length]);

    return (
        <div className={styles.container}>
            <Image
                src={bgImages[currentImageIndex].bg}
                alt="Background Image"
                fill
                style={{ objectFit: "cover" }}
                className={`${styles.bgImages} ${styles.fadeIn}`}
            />

            <div className={styles.overlay}></div>
            <Image src="/images/pazLeftBG.png" alt="PAZ Logo" width={700} height={237.01} className={styles.logo} />
            <div className={styles.content}>
                <LeftText
                    text={bgImages[currentImageIndex].text}
                    currentIndex={currentImageIndex}
                    totalSlides={bgImages.length}
                    onNext={goToNext}
                    onPrev={goToPrev}
                    animationKey={animationKey}
                    slideDuration={SLIDE_DURATION}
                    isAutoPlaying={isAutoPlaying}
                />
            </div>
        </div>
    );
}

export default LeftCaurosel