import React from 'react';
import styles from './ProgressBar.module.css';

type Props = {
  progress: number;
};

const ProgressBar = ({ progress }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className={styles.text}>{progress}% to completion</p>
    </div>
  );
};

export default ProgressBar;
