import LeftCaurosel from "@/components/onboarding/LeftCaurosel";
import styles from "./layout.module.css";

type Props = {
  children: React.ReactNode;
};

/* The email verification page */
const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <LeftCaurosel view="logged in" />
      </div>
      <div className={styles.rightContainer}>{children}</div>
    </div>
  );
};

export default Layout;
