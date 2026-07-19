"use client";
import React from "react";
import Modal2 from "@/components/Modal2";
import styles from "./BusinessLoanModal.module.css";
import { MdChevronRight } from "react-icons/md";

type BusinessOption = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  onSelect?: VoidFunction;
  comingSoon?: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  options: BusinessOption[];
};

const BusinessLoanModal = ({ isOpen, onClose, options }: Props) => (
  <Modal2 isOpen={isOpen} onClose={onClose} width={551} title="Business Loan">
    <div className={styles.container}>
      <p className={styles.subtitle}>
        Select the kind of business loan you would like to apply for and with all
        necessary documents, and you will be given.
      </p>
      <div className={styles.list}>
        {options.map((opt) => (
          <BusinessOptionItem key={opt.title} opt={opt} />
        ))}
      </div>
    </div>
  </Modal2>
);

const BusinessOptionItem = ({ opt }: { opt: BusinessOption }) => {
  const [hover, setHover] = React.useState(false);

  const handleClick = () => {
    if (opt.comingSoon) return;
    opt.onSelect && opt.onSelect();
    try {
      console.log("Business option clicked:", opt.title);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={styles.item}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      role="button"
      aria-disabled={opt.comingSoon ? true : false}
    >
      <div className={styles.left}>
        <div className={styles.iconWrapper} style={{ backgroundColor: opt.iconBg }}>
          {opt.icon}
        </div>
        <div className={styles.textWrapper}>
          <p className={styles.optionTitle}>{opt.title}</p>
          <p className={styles.optionDesc}>{opt.comingSoon && hover ? "Coming soon" : opt.description}</p>
        </div>
      </div>
      <MdChevronRight size={20} color="#878787" />
    </div>
  );
};

export default BusinessLoanModal;