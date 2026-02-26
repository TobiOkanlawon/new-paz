import styles from "./dashboard.module.css";
const Dashboard = () => {
  const firstName = "Esther";

  return (
    <div>
      <div>
        <h1>Welcome, {firstName}</h1>
        <p>Here is what is happening with your account today</p>
      </div>

      <div className={styles.accountCards}></div>
      <div>
        <h2>Quick Actions</h2>
        <div className={styles.quickActionCards}></div>
      </div>

      <div className={styles.bottomContainer}></div>
    </div>
  );
};

export default Dashboard;
