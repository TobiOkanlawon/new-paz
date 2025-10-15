import styles from "./pill.module.css";

type Props = {
  content: string;
  handleClick?: () => void;
};

const Pill: React.FC<Props> = ({ content, handleClick }) => {
  return (
    <div onClick={handleClick} className={styles.container}>
      <span className={styles.content}>{content}</span>
    </div>
  );
};

export default Pill;
