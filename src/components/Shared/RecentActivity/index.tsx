import styles from "./recentactivity.module.css";
import Image from "next/image";

interface Activity {
  id: string;
  title: string;
  description?: string;
  amount?: number;
  time: string;
  type?: "deposit" | "withdrawal" | "created" | "update";
}

type Props = {
  activity?: Activity[];
};

const RecentActivity: React.FC<Props> = ({ activity }) => {
  if (!activity || activity.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.notificationWrapper}>
          <div className={styles.emptyContainer}>
            <Image
              src="/noNotification.png"
              alt="No notification image"
              width={100}
              height={100}
            />
            <p>You have no recent activities yet!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.activities}>
      <h5>Recent activity</h5>

      {activity.map((item) => (
        <div key={item.id} className={styles.activitiesList}>
          <h4>
            <Image
              src="/activityLogo.png"
              alt="Activity Logo"
              width={30}
              height={30}
            />
            {item.title}
          </h4>

          {item.amount && <h6>₦ {item.amount.toLocaleString()}</h6>}

          <p>{item.time}</p>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
