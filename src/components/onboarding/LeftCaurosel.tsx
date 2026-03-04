"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./LeftStyle.module.css";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type Props = {
  view?: "logged in";
};

const SLIDE_DURATION = 6000;

const LoggedInView = () => {
  const handleLogout = () => {
    signOut();
  };

  return (
    <div className={styles.buttonContainer}>
      <div className={styles.loginButton}>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

const LeftCaurosel: React.FC<Props> = ({ view }) => {
  const bgImages = [
    {
      bg: "/images/leftBG11.png",
      text: "PAZ is a simple and secure platform that helps people save smarter and manage payments with ease. It is built for everyday users who want clarity, control, and peace of mind when handling their money.",
    },
    {
      bg: "/images/leftBG21.png",
      text: "With PAZ, users can create an account in minutes, verify their identity seamlessly and start saving and making withdrawal without unnecessary complexity. Every feature is designed to feel intuitive, fast and trustworthy.",
    },
    {
      bg: "/images/leftBG31.png",
      text: "PAZ is a simple and secure platform that helps people save smarter and manage payments with ease. It is built for everyday users who want clarity, control, and peace of mind when handling their money.",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
      setAnimationKey((prev) => prev + 1);
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [currentImageIndex, isAutoPlaying, bgImages.length]);

  const goToNext = useCallback(() => {
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
      setAnimationKey((prev) => prev + 1);
      setIsAutoPlaying(true);
    }, 30);
  }, [bgImages.length]);

  const goToPrev = useCallback(() => {
    setTimeout(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + bgImages.length) % bgImages.length,
      );
      setAnimationKey((prev) => prev + 1);
      setIsAutoPlaying(true);
    }, 300);
  }, [bgImages.length]);

  const skip = useCallback(() => {
    setCurrentImageIndex(bgImages.length - 1);
    setAnimationKey((prev) => prev + 1);
    setIsAutoPlaying(true);
  }, [bgImages.length]);

  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.bgContainer}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/pazLeftBG.png"
            alt="PAZ Logo"
            width={158}
            height={51}
            className={styles.logo}
          />
          <div className={styles.onboardingSkip} onClick={skip}>
            <p>Skip</p>
          </div>
        </div>

        <div className={styles.onboardingImage}>
          <Image
            src={bgImages[currentImageIndex].bg}
            alt="Background Image"
            width={611}
            height={358}
            style={{ objectFit: "cover" }}
            className={`${styles.bgImages} ${styles.fadeIn}`}
          />
        </div>

        <div className={styles.textContainer}>
          <p className={styles.text}>{bgImages[currentImageIndex].text}</p>
        </div>

        <div className={styles.indicatorContainer}>
          <FaChevronLeft
            className={styles.chevronIcon}
            onClick={goToPrev}
            style={{ cursor: "pointer" }}
          />
          <div className={styles.indicatorsContainer}>
            {bgImages.map((_, index) => (
              <span
                key={index}
                className={`${styles.indicator} ${currentImageIndex === index ? styles.indicatorActive : ""}`}
              >
                {currentImageIndex === index && isAutoPlaying && (
                  <span
                    key={animationKey}
                    className={styles.loader}
                    style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                  />
                )}
              </span>
            ))}
          </div>
          <FaChevronRight
            className={styles.chevronIcon}
            onClick={goToNext}
            style={{ cursor: "pointer" }}
          />
        </div>

        {view == "logged in" ? (
          <LoggedInView />
        ) : (
          <div className={styles.buttonContainer}>
            <div className={styles.loginButton}>
              <Button variant="outlined" onClick={handleLogin}>
                Login
              </Button>
            </div>
            <button className={styles.nextButton} onClick={goToNext}>
              Next <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftCaurosel;
