import React from "react";
import Modal2 from "@/components/Modal2";
import styles from "./BusinessLoanModal.module.css";
import { MdChevronRight } from "react-icons/md";

type BusinessOption = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  onSelect: VoidFunction;
};

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  options: BusinessOption[];
};

const BusinessLoanModal = ({ isOpen, onClose, options }: Props) => (
  <Modal2 isOpen={isOpen} onClose={onClose} width={551}>
    <div className={styles.container}>
      <h2 className={styles.title}>Business Loan</h2>
      <p className={styles.subtitle}>
        Select the kind of business loan you would like to apply for and with all
        necessary documents, and you will be given.
      </p>
      <div className={styles.list}>
        {options.map((opt) => (
          <div key={opt.title} className={styles.item} onClick={opt.onSelect}>
            <div className={styles.left}>
              <div className={styles.iconWrapper} style={{ backgroundColor: opt.iconBg }}>
                {opt.icon}
              </div>
              <div className={styles.textWrapper}>
                <p className={styles.optionTitle}>{opt.title}</p>
                <p className={styles.optionDesc}>{opt.description}</p>
              </div>
            </div>
            <MdChevronRight size={20} color="#878787" />
          </div>
        ))}
      </div>
    </div>
  </Modal2>
);

export default BusinessLoanModal;