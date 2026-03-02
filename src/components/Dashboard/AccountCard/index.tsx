import Image, { ImageProps } from "next/image";
import styles from "./styles.module.css";
import ThreeDots from "@/assets/three-dots.svg";

type AccountCardProps = {
  icon: string | ImageProps["src"];
  backgroundColor: string;
  color: string;
  title: string;
  amount: number;
};

const AccountCard: React.FC<AccountCardProps> = ({
  icon,
  title,
  backgroundColor,
  color,
  amount = 0,
}) => {
  const formattedAmount = (amount: number) => {
    /* takes a number in naira and formats it to have two decimal points */

    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.topContainer}>
        <div
          style={{ backgroundColor: backgroundColor }}
          className={styles.iconContainer}
        >
          <Image
            style={{ stroke: color }}
            width={24}
            height={24}
            src={icon}
            alt=""
          />
        </div>

        <Image width={16} height={16} src={ThreeDots} alt="three-dots" />
      </div>

      <p className={styles.titleText}>{title}</p>

      <div className={styles.bottomContainer}>
        &#x20A6; <span>{formattedAmount(amount)}</span>
      </div>
    </div>
  );
};

export default AccountCard;
