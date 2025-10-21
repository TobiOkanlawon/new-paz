import styles from "./pill.module.css";

type Props = {
  content: string;
  handleClick?: () => void;
  isActive?: boolean;
};

const Pill: React.FC<Props> = ({ content, handleClick, isActive = false }) => {
  return (
    <div 
      onClick={handleClick} 
      className={`${styles.container} ${isActive ? styles.active : ''}`}
    >
      <span className={styles.content}>{content}</span>
    </div>
  );
};

export default Pill;