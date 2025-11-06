import styles from "./consentmodal.module.css";
import Modal from "@/components/Modal";

type Props = {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  tenure: string;
  handleTakeLoan: () => void;
};

const ConsentModal: React.FC<Props> = ({
  isOpen,
  amount,
  tenure,
  handleTakeLoan,
  onClose,
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={styles.eligibilityDetails}>
        <h3>Loan Eligibility</h3>
        <p>You are eligible to collect</p>
        <h1>{`₦ ${Intl.NumberFormat("en-US").format(amount)}`}</h1>
        <h6>
          For a period of <span>{tenure}</span>
        </h6>
        <button onClick={handleTakeLoan}>Take Loan</button>
      </div>
    </Modal>
  );
};

export default ConsentModal;
