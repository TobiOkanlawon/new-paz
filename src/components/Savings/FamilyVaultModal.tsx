import { LuCopy } from "react-icons/lu";
import styles from "./styles.module.css";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Pill from "../Pill";
import Button from "@/components/Button";

type Props = {
  isActive: boolean;
  handleCloseModal: () => void;
};

const FamilyVaultModal: React.FC<Props> = ({ isActive, handleCloseModal }) => {
  const preferredAmounts = [5000, 10000, 50000, 100000];
  const savingsDurations = ["6 months", "1 year", "2 years", "5 years"];

  return (
    <Modal isOpen={isActive} onClose={handleCloseModal}>
      <form className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h1>PAZ Family Vault</h1>
          <p>Begin your journey to financial freedom</p>
        </div>

        <div className={styles.formContent}>
          <div className={styles.formGroup}>
            <Input
              id="familyName"
              type="text"
              label="Enter your family name"
              placeholder="Enter your family name"
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.addFamilyMemberInstruction}>
              <button type="button" className={styles.copyLinkButton}>
                <LuCopy /> Copy link
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Select preferred amount</label>
            <div className={styles.pillContainer}>
              {preferredAmounts.map((amount) => (
                <Pill
                  key={`amount-${amount}`}
                  handleClick={() => {}}
                  content={new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(amount)}
                  isActive={false}
                />
              ))}
            </div>
            <Input
              type="number"
              id="preferredAmount"
              placeholder="Or specify amount"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="savingFrequency">Select Saving Frequency</label>
            <select
              name="savingFrequency"
              id="savingFrequency"
              className={styles.selectInput}
            >
              <option value="2 months">2 months</option>
              <option value="3 months">3 months</option>
              <option value="4 months">4 months</option>
              <option value="5 months">5 months</option>
              <option value="6 months">6 months</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Select savings duration</label>
            <div className={styles.pillContainer}>
              {savingsDurations.map((duration) => (
                <Pill
                  key={duration}
                  handleClick={() => {}}
                  content={duration}
                  isActive={false}
                />
              ))}
            </div>
            <Input
              type="number"
              id="customDuration"
              placeholder="Or specify duration"
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button
            type="submit"
            className={styles.submitButton}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Create Savings
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FamilyVaultModal;