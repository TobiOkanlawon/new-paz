"use client";

import React, { useState } from "react";
import TransactionsTable, { TransactionRow } from "@/components/TransactionTable/TransactionTable";
import styles from "./emptyDashboard/emptyDash.module.css";
import Image from "next/image";
import NoRecord from "@/assets/noRecord.png";
import ActiveLoansTable from "@/components/Loans/ActiveLoanTable/ActiveLoansTable";

type Props = {
  rows: [];
};

const LoansClient = ({ rows }: Props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  return rows && rows.length > 0 ? (
    <ActiveLoansTable
      rows={rows}
      totalEntries={20}
      totalPages={20}
      currentPage={1}
      onPageChange={(page) => console.log(page)}
    />

  ) : (
    <div className={styles.bottomContainerNone}>
      <Image src={NoRecord} alt="No transactions" width={124} height={120} />
    </div>
  );
};

export default LoansClient;
