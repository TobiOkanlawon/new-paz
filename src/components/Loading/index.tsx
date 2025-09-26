import styles from './Loading.module.css';

export const Loading = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
};