import styles from "./preauthlayout.module.css";

type Props = {
  carousel: React.ReactNode;
  children: React.ReactNode;
};

const PreAuthLayout: React.FC<Props> = ({ carousel, children }) => {
  return (
    <>
      <div className={styles.leftContainer}>{carousel}</div>
      <div className={styles.rightContainer}>{children}</div>
    </>
  );
};

export default PreAuthLayout;
