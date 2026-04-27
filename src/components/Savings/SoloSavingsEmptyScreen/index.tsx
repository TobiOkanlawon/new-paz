import styles from "./styles.module.css";
import Link from "next/link";
import Button from "@/components/Button";

const EmptyScreen = () => {
  return (
    <main className={styles.container}>
      {/* Heading section */}
      <div className={styles.headingContainer}>
        <div className={styles.headingLeft}>
          <h1 className={styles.headingText}>Solo Savers</h1>
          <p className={styles.subHeadingText}>
            Explore all of our savings plans here
          </p>
        </div>
      </div>

      {/* Body section */}
      <div className={styles.bodySection}>
        <p>You do not yet have a solo saver's plan</p>
        <Link href="/dashboard/savings/create" className={styles.link}>
          <Button className={styles.button}>Create a Solo Saver's Plan</Button>
        </Link>
      </div>
    </main>
  );
};

export default EmptyScreen;
