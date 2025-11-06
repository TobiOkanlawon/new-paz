import styles from "./recentactivity.module.css";
import Image from "next/image";
import NotificationContainer from "@/components/NotificationContainer";

type Props = {
  activity?: any[];
};

const RecentActivity: React.FC<Props> = ({ activity }) => {
  if (!activity || activity.length == 0) {
    return (
      <div className={styles.container}>
        <div className={styles.notificationWrapper}>
          <div className={styles.emptyContainer}>
            <Image
              src={"/noNotification.png"}
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
      <h5>Recent activitiy</h5>
      <div className={styles.activitiesList}>
        <h4>
          <Image
            src="/activityLogo.png"
            alt="Activity Logo"
            width={30}
            height={30}
          />
          PAZ family vault created
        </h4>
        <p>2:45pm</p>
      </div>
      <div className={styles.activitiesList}>
        <h4>
          <Image
            src="/activityLogo.png"
            alt="Activity Logo"
            width={30}
            height={30}
          />
          Money withdrawn from savings
        </h4>
        <h6>₦ 50,000</h6>
        <p>2 days ago</p>
      </div>
    </div>
  );
};

export default RecentActivity;
