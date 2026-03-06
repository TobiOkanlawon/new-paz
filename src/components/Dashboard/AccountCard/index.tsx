import Image, { ImageProps } from "next/image";
import styles from "./styles.module.css";
import ThreeDots from "@/assets/three-dots.svg";
import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

type AccountCardProps = {
  icon: string | ImageProps["src"];
  backgroundColor: string;
  color: string;
  title: string;
  amount: number;
  rate?: number;
  rateBackgroundColor?: string;
  rateTextColor?: string;
};

const AccountCard: React.FC<AccountCardProps> = ({
  icon,
  title,
  backgroundColor,
  color,
  amount = 0,
  rate = 0,
  rateBackgroundColor = "#E8F8EE",
  rateTextColor = "#12B76A",
}) => {
  const [showAmount, setShowAmount] = useState(true);

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
        <div className={styles.amountWrap}>
          <span className={styles.amountText}>
            {showAmount ? `NGN ${formattedAmount(amount)}` : "NGN ••••••"}
          </span>
          <button
            type="button"
            className={styles.toggleAmountBtn}
            onClick={() => setShowAmount((prev) => !prev)}
            aria-label={showAmount ? "Hide amount" : "Show amount"}
          >
            {showAmount ? <LuEye size={24} /> : <LuEyeOff size={24} />}
          </button>
        </div>

        <span
          className={styles.ratePill}
          style={{ backgroundColor: rateBackgroundColor, color: rateTextColor }}
        >
          {rate > 0 ? `+${rate}%` : `${rate}%`}
        </span>
      </div>
    </div>
  );
};

export default AccountCard;
