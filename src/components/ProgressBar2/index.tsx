import React from 'react';
import styles from './progressBar.module.css';

interface ProgressBarProps {
  percentage: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <>
        <div className={styles.progressBarContainer}>
        <div
            className={styles.progressBarFill}
            style={{ width: `${percentage}%` }}
        />
        </div>
        <span className={styles.progressText}>{percentage.toFixed(1)}% to completion</span>
    </>
  );
};

export default ProgressBar;