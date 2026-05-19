"use client";
import React from "react";
import styles from "./availableLoans.module.css";
import { motion } from "framer-motion";

type Props = {
    icon: React.ReactNode;
    iconBg: string;
    duration: string;
    title: string;
    description: string;
    accentColor: string;
    onApply?: VoidFunction;
};

const LoanTypeCard = ({
    icon,
    iconBg,
    duration,
    title,
    description,
    accentColor,
    onApply,
}: Props) => {
    return (
        <div className={styles.card}>
            {/* Top Row */}
            <div className={styles.topRow}>
                <div className={styles.iconWrapper} style={{ backgroundColor: iconBg }}>
                    {icon}
                </div>
                <span className={styles.duration}>{duration}</span>
            </div>

            {/* Text */}
            <div className={styles.textContainer}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>

            {/* Apply Button */}
            <motion.button
                className={styles.applyBtn}
                style={{ color: accentColor, backgroundColor: `${accentColor}20` }}
                onClick={onApply}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                    type: "spring",
                    mass: 1,
                    stiffness: 80,
                    damping: 20,
                }}
            >
                Apply Now
            </motion.button>
        </div>
    );
};

export default LoanTypeCard;