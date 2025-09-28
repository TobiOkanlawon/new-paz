import Image, { StaticImageData } from "next/image";
import styles from "./styles.module.css";
import { LuEye, LuEyeOff } from "react-icons/lu";
import clsx from "clsx";
type Props = {
  className: string;
  cornerImage: StaticImageData;
  title: string;
  amount: number;
  isAmountVisible: boolean;
  toggleAmountVisibility: () => void;
};

export const AccountCard: React.FC<Props> = ({
  title,
  className,
  isAmountVisible,
  amount,
  cornerImage,
  toggleAmountVisibility,
}) => {
  return (
    <div className={clsx(styles.totalCategories, className)}>
      <div className={styles.textIcon}>
        <p>{title}</p>
        <Image src={cornerImage} width={40} height={40} alt="Savings" />
      </div>
      <h3>
        ₦ {isAmountVisible ? <>{amount}</> : "****"}{" "}
        <span
          style={{ cursor: "pointer", fontSize: "1rem" }}
          onClick={toggleAmountVisibility}
        >
          {isAmountVisible ? <LuEye /> : <LuEyeOff />}
        </span>
      </h3>
    </div>
  );
};
