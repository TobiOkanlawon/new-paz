"use client";

import React, { useState } from "react";
import TransactionsTable, { TransactionRow } from "@/components/TransactionTable/TransactionTable";
import styles from "./emptyDashboard/emptyDash.module.css";
import Image from "next/image";
import NoRecord from "@/assets/noRecord.png";

type Props = {
  rows: TransactionRow[];
};

const LoansClient = ({ rows }: Props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  return rows && rows.length > 0 ? (
    <TransactionsTable
      rows={rows}
      total={rows.length}
      page={page}
      pageSize={pageSize}
      onPageChange={(p) => setPage(p)}
      onPageSizeChange={(s) => {
        setPageSize(s);
        setPage(1);
      }}
      showFilter={false}
      leftControls={
        <select className={styles.tableControl}>
          <option>Transaction status</option>
          <option>Success</option>
          <option>Pending</option>
        </select>
      }
      rightControls={
        <div className={styles.tableRightControls}>
          <button className={styles.tableControlButton}>Filters</button>
          <button className={styles.tableControlButton}>
            Wed, 3 Sept, 2024 - Sat, 5 Sept, 2024
          </button>
        </div>
      }
    />
  ) : (
    <div className={styles.bottomContainerNone}>
      <Image src={NoRecord} alt="No transactions" width={124} height={120} />
    </div>
  );
};

export default LoansClient;
