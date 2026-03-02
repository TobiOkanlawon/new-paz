import styles from "./recentTransactions.module.css";
import ThreeDots from "@/assets/three-dots.svg";
import Upright from "@/assets/up-right.svg";
import Image from "next/image";

type Props = {
  title: string;
  subTitle: string;
  // this dictates the kind of icon that will show
  status: "outbound" | "pending" | "inbound";
  amount: string;
  date: string;
};

const RecentTransactionsCard: React.FC<Props> = ({
  title,
  subTitle,
  status,
  amount,
  date,
}) => {
  let backgroundColor = "";
  let color = "";

  switch (status) {
    case "outbound":
      backgroundColor = "#EBFFF2";
      color = "#22C55E";
      break;
    default:
      backgroundColor = "#FFE8E8";
      color = "#DC2626";
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <div
          style={{ backgroundColor: backgroundColor }}
          className={styles.iconContainer}
        >
          {status == "inbound" && (
            <Image height={28} width={28} src={Upright} alt="" />
          )}
        </div>
        <div className={styles.textContainer}>
          <p className={styles.title}>{title}</p>
          <p className={styles.subTitle}>{subTitle}</p>
        </div>
      </div>
      <div className={styles.cardRight}>
        <div className={styles.cardRightRight}>
          <div className={styles.cardRightRightLeft}>
            <p className={styles.amount}>{amount}</p>
            <p className={styles.date}>{date}</p>
          </div>
        </div>
        <Image src={ThreeDots} alt="" />
      </div>
    </div>
  );
};

export default RecentTransactionsCard;
