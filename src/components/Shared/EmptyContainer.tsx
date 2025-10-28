import Image from "next/image";
import styles from "./emptyContainer.module.css";
import NoNotification from "@/images/noNotification.png";

type Props = {
  text?: string;
};

const EmptyContainer: React.FC<Props> = ({
  text = "You have no recent activities yet!",
}) => {
  return (
    <div className={styles.emptyContainer}>
      <Image
        src={NoNotification}
        alt="No notification image"
        width={100}
        height={100}
      />
      <p>{text}</p>
    </div>
  );
};

export default EmptyContainer;
