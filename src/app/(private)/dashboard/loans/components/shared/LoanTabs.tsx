import React from "react";
import styles from "./LoanTabs.module.css";

type Props = {
  tabs: string[];
  activeTab: number;
};

const LoanTabs = ({ tabs, activeTab }: Props) => (
  <div className={styles.tabs}>
    {tabs.map((tab, i) => (
      <span
        key={tab}
        className={`${styles.tab} ${i === activeTab ? styles.active : ""}`}
      >
        {tab}
      </span>
    ))}
  </div>
);

export default LoanTabs;