"use client";
import React from "react";
import { signOut } from "next-auth/react";
import Modal2 from "@/components/Modal2";
import LoanTabs from "../../loans/components/shared/LoanTabs";
import BvnStep from "./BvnStep";
import AccountStep from "./AccountStep";
import styles from "./AccountGate.module.css";

const TABS = ["Verify BVN", "Add Bank Account"];

type Props = {
  isBvnVerified: boolean;
  primaryAccountLinked: boolean;
  onBvnVerified: VoidFunction;
  onAccountLinked: VoidFunction;
};

const AccountGate = ({
  isBvnVerified,
  primaryAccountLinked,
  onBvnVerified,
  onAccountLinked,
}: Props) => {
  return (
    <div className={styles.background}>
      <Modal2 isOpen width={480} title="Complete Your Account Setup">
        <div className={styles.container}>
          <p className={styles.subtitle}>
            Verify your BVN and add a bank account to start using your dashboard.
          </p>

          <LoanTabs tabs={TABS} activeTab={isBvnVerified ? 1 : 0} />

          {!isBvnVerified && <BvnStep onVerified={onBvnVerified} />}
          {isBvnVerified && !primaryAccountLinked && <AccountStep onLinked={onAccountLinked} />}

          <div className={styles.logoutRow}>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Log out
            </button>
          </div>
        </div>
      </Modal2>
    </div>
  );
};

export default AccountGate;
