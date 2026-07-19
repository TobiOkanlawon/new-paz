import React from "react";
import Modal2 from "@/components/Modal2";
import styles from "./EligibilityModal.module.css";
import { LuCircleCheckBig } from "react-icons/lu";
import Button from "@/components/Button";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  navigateToNext: () => void;
};

const criteria = [
  "Applicants must be 18years and above.",
  "Valid means of identification (NIN, BVN)",
  "Proof of Income",
  "Credit worthiness",
  "Valid phone number and email address",
];

const EligibilityModal = ({ isOpen, onClose, navigateToNext }: Props) => {
  return (
    <Modal2 isOpen={isOpen} onClose={onClose} title="Eligibility Criteria">
      <div className={styles.container}>
        <ul className={styles.list}>
          {criteria.map((item, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.text}>{item}</span>
              <LuCircleCheckBig size={24} color="#17A842" strokeWidth={2} />
            </li>
          ))}
        </ul>

        <div className={styles.bottomContainer}>
          <Button onClick={navigateToNext}>Get a loan</Button>
        </div>
      </div>
    </Modal2>
  );
};

export default EligibilityModal;
