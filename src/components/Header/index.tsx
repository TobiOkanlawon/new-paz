import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerRight}>
        <p>quick actions</p>
        <div className={styles.headerRightRight}>
          <p>not</p>
          <p>esther</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
