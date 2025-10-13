import { LuCopy } from "react-icons/lu";
import styles from "./styles.module.css";
import Modal from "@/components/Modal";

type Props = {
  isActive: boolean;
  handleCloseModal: () => void;
};

const FamilyVaultModal: React.FC<Props> = ({ isActive, handleCloseModal }) => {
  return (
    <Modal isOpen={isActive} onClose={handleCloseModal}>
      <form className={styles.modalContainer}>
        <h1>PAZ Family Vault</h1>
        <p>Begin your journey to financial freedom</p>
        <label htmlFor="famName">Family name</label>
        <div className={styles.famNameContainer}>
          <input
            type="text"
            id="famName"
            placeholder="Enter your family name"
          />
        </div>
        <label htmlFor="addFam">Add Family Member</label>
        <div className={styles.addFam}>
          <input
            type="text"
            id="addFam"
            placeholder="Enter family member account name"
          />
          <button>
            <LuCopy /> Copy link
          </button>
        </div>
        <label className={styles.preferredAmountLabel}>
          Select preferred amount
        </label>
        <div className={styles.preferredAmount}>
          <button value={"5000"}>5,000</button>
          <button value={"10000"}>10,000</button>
          <button value={"50000"}>50,000</button>
          <button value={"100000"}>100,000</button>
          <input
            type="number"
            name="preferredAmount"
            id="preferredAmount"
            placeholder="specify amount"
          />
        </div>
        <label htmlFor="savingFrequency">Select Saving Frequency</label>
        <div className={styles.frequentSavings}>
          <select name="savingFrequency" id="savingFrequency">
            <option value="2 months">2 months</option>
            <option value="3 months">3 months</option>
            <option value="4 months">4 months</option>
            <option value="5 months">5 months</option>
            <option value="6 months">6 months</option>
          </select>
        </div>
        <label className={styles.savingsDurationLabel}>
          Select savings duration
        </label>
        <div className={styles.savingsDuration}>
          <button>6 months</button>
          <button>1 year</button>
          <button>2 years</button>
          <button>5 years</button>
          <input
            type="number"
            name="preferredAmount"
            id="preferredAmount"
            placeholder="Specify Duration"
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Create Savings
        </button>
      </form>
    </Modal>
  );
};

export default FamilyVaultModal;
