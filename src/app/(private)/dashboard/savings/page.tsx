"use client";
import React, { useEffect, useState } from "react";
import styles from "./savings.module.css";
import Image, { StaticImageData } from "next/image";
import Button from "@/components/Button";
import SavingsPlanMiniCard from "@/components/Savings/SavingsCard";

import Rose from "@/assets/noto_rose.svg";
import Piggy from "@/assets/piggy-bank.svg";
import SavingsWalletCard from "@/components/Savings/SavingsScreenCard";
import TransactionsTable, {
  TransactionRow,
} from "@/components/TransactionTable/TransactionTable";

import { getAccountSummary } from "@/actions/dashboard";
import { getTotalBalance } from "@/libs/helpers";
import Link from "next/link";

const Savings = () => {
  const rows: TransactionRow[] = [
    {
      id: "1",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "2",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Pending",
    },
    {
      id: "3",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "4",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "5",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "6",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
  ];

  const [amount, setAmount] = useState("0.00");

  const loadAccountSummary = async () => {
    try {
      const email = "user@email.com"; // replace with real user email

      const result = await getAccountSummary(email);

      if (result.success) {
        const balance = getTotalBalance(result.data, "savings");
        setAmount(balance.toFixed(2));
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAccountSummary;
  }, []);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div className={styles.headingLeft}>
          <h1 className={styles.firstNameText}>Savings</h1>
          <p className={styles.subHeadingText}>
            Explore all of our savings plans here
          </p>
        </div>
        <div className={styles.headingRight}>
          <Link href="/dashboard/savings/create">
            <Button className={styles.outlineButton}>Create Savings</Button>
          </Link>
          <Button className={styles.outlineButton}>Withdraw Funds</Button>
          <Button>Fund Account</Button>
        </div>
      </div>

      <div className={styles.midSection}>
        <div className={styles.savingsCard}>
          <SavingsWalletCard amount={amount} />
        </div>
        <div className={styles.midSectionRight}>
          <Button className={styles.outlineButton}>Add Debit Card</Button>
          <Button>Link Account</Button>
        </div>
      </div>

      <div className={styles.savingsPlansContainer}>
        <h2>Savings Plans</h2>
        <div className={styles.savingsPlanInnerContainer}>
          <SavingsPlanMiniCard
            title="Solo Savers"
            image={Piggy}
            content="Save money regularly in a locked plan with interest up to 12% per annum."
            borderColor="#214CCF"
            imageBackgroundColor="#E9EDFA"
            showTopRightIcon={false}
          />
          <SavingsPlanMiniCard
            title="Target Savers"
            image={Rose}
            content="Save money regularly in a locked plan with interest up to 12% per annum."
            borderColor="#22C55E"
            imageBackgroundColor="#E9EDFA"
            showTopRightIcon={false}
          />
          {/*<SavingsPlanMiniCard
            title="Family Vault"
            image={Rose}
            content="Save money daily, bi-weekly plan with a purpose in mind."
            borderColor="#214CCF"
            imageBackgroundColor="#E9EDFA"
            showTopRightIcon={false}
            />*/}
        </div>
      </div>
      <TransactionsTable
        rows={rows}
        total={20}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        leftControls={
          <select
            style={{
              height: 34,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              padding: "0 10px",
            }}
          >
            <option>Transaction status</option>
            <option>Success</option>
            <option>Pending</option>
          </select>
        }
        rightControls={
          <>
            <button
              style={{
                height: 34,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                padding: "0 10px",
                background: "#fff",
              }}
            >
              Filters
            </button>
            <button
              style={{
                height: 34,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                padding: "0 10px",
                background: "#fff",
              }}
            >
              Wed, 3 Sept, 2024 - Sat, 5 Sept, 2024
            </button>
          </>
        }
      />
    </div>
  );
};

export default Savings;
