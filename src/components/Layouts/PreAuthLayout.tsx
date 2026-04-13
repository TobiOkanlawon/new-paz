import styles from "./preauthlayout.module.css";

type Props = {
  carousel: React.ReactNode;
  children: React.ReactNode;
};

const PreAuthLayout: React.FC<Props> = ({ carousel, children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>{carousel}</div>
      <div className={styles.rightContainer}>{children}</div>
    </div>
  );
};

export default PreAuthLayout;
