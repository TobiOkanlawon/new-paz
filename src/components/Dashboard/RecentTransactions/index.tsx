import styles from "./recentTransactions.module.css";
import ThreeDots from "@/assets/three-dots.svg";
import Image from "next/image";
import { LuArrowUpRight, LuArrowDownLeft } from "react-icons/lu";

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
  let icon = null;

  switch (status) {
    case "outbound":
      backgroundColor = "#FFE8E8";
      icon = <LuArrowUpRight color="#DC2626" size={24} />;
      break;
    default:
      backgroundColor = "#EBFFF2";
      icon = <LuArrowDownLeft color="#22C55E" size={24} />;
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <div
          style={{ backgroundColor: backgroundColor }}
          className={styles.iconContainer}
        >
          {icon}
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
