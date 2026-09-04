"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./dashboard.module.css";
import Piggy from "@/assets/piggy-bank.png";
import LoanIcon from "@/assets/wallet.png";
import InvestmentIcon from "@/assets/investments.png";
import StashIcon from "@/assets/Ngn.png";
import WithdrawIcon from "@/assets/withdraw-icon.png";
import NoRecord from "@/assets/noRecord.png";
import AccountCard from "./AccountCard";
import QuickActionCard from "./QuickActionCard";
import BottomLeft from "./BottomLeft";
import BottomRight from "./BottomRight";
import FundAccountFlow from "@/components/ModalFlows/FundAccountFlow";
import FundWalletFlow from "@/components/ModalFlows/FundWalletFlow";

import { HiOutlineCash } from "react-icons/hi";

// TODO: do proper types
interface DashboardClientProps {
  firstName: string;
  savingsAmount: number;
  loanAmount: number;
  investmentAmount: number;
  isTransactions: boolean;
  accounts: any;
  allTransactions: any[];
  accountDetails: TAccountDetails;
  hasOutstandingActiveLoan?: boolean;
  hasPendingLoanRequest?: boolean;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  firstName,
  savingsAmount,
  loanAmount,
  investmentAmount,
  isTransactions,
  accounts,
  allTransactions,
  accountDetails,
  hasOutstandingActiveLoan = false,
  hasPendingLoanRequest = false,
}) => {
  const router = useRouter();

  const handleGetLoan = () => {
    if (hasOutstandingActiveLoan) {
      toast.error(
        "You have an active loan. Please repay it before applying for a new one.",
      );
    } else if (hasPendingLoanRequest) {
      toast.error(
        "You already have a loan application pending approval. Please wait for it to be reviewed before applying again.",
      );
    }

    // Still navigate either way — the Loans page shows the correct
    // repay/pending state and is never a dead end.
    router.push("/dashboard/loans");
  };

  return (
    <>
      <div className={styles.container}>
        <div>
          <h1 className={styles.firstNameText}>Welcome, {firstName}</h1>
          <p className={styles.subHeadingText}>
            Here is what is happening with your account today
          </p>
        </div>

        <div className={styles.accountCards}>
          <AccountCard
            backgroundColor="#E9EDFA"
            amount={accountDetails?.walletAmount ?? 0}
            icon={
              // <Image
              //   src={StashIcon}
              //   alt="Dashboard"
              //   className={styles.sidebarIcon}
              //   width={24}
              //   height={24}
              // />
               <HiOutlineCash style={{fontSize: "24px"}} />
            }
            iconColor="#214CCF"
            title="Stash"
            rateBackgroundColor="#E9EDFA"
            rateTextColor="#214CCF"
          />

          <AccountCard
            backgroundColor="#EBFFF2"
            amount={savingsAmount ?? 0}
            icon={
              <Image
                src={Piggy}
                alt="Dashboard"
                className={styles.sidebarIcon}
                width={24}
                height={24}
              />
            }
            iconColor="#22C55E"
            title="total savings"
            rateBackgroundColor="#DBF8E8"
            rateTextColor="#12B76A"
          />
          <AccountCard
            backgroundColor="#E0DFFD"
            amount={loanAmount ?? 0}
            icon={
              <Image
                src={LoanIcon}
                alt="Dashboard"
                className={styles.sidebarIcon}
                width={24}
                height={24}
              />
            }
            iconColor="#22C55E"
            title="Total Loans"
            rateBackgroundColor="#DBF8E8"
            rateTextColor="#12B76A"
          />
          <AccountCard
            backgroundColor="#F9EAD1"
            amount={investmentAmount ?? 0}
            icon={
              <Image
                src={InvestmentIcon}
                alt="Dashboard"
                className={styles.sidebarIcon}
                width={24}
                height={24}
              />
            }
            iconColor="#22C55E"
            title="Total Investments (COMING SOON)"
          />
        </div>

        <FundWalletFlow>
          {(openFundWalletModal) => (
            <FundAccountFlow
              accountSummary={accountDetails}
              onCompleted={() => {
                // Optional: Handle completion if needed
              }}
            >
              {(openFundModal) => (
                <div className={styles.quickActionContainer}>
                  <h2>Quick Actions</h2>
                  <div className={styles.quickActionCards}>
                    <div className={styles.quickActionCardsInnerContainer}>
                      <QuickActionCard
                        action={openFundModal}
                        backgroundColor="#EBFFF2"
                        icon={
                          <Image
                            src={Piggy}
                            alt="Dashboard"
                            className={styles.sidebarIcon}
                            width={24}
                            height={24}
                          />
                        }
                        text="Add to Savings"
                      />
                      <QuickActionCard
                        action={openFundWalletModal}
                        backgroundColor="#E9EDFA"
                        icon={<HiOutlineCash style={{ fontSize: "24px", color: "#214CCF" }} />}
                        text="Fund Wallet"
                      />
                      <QuickActionCard
                        action={handleGetLoan}
                        backgroundColor="#E0DFFD"
                        icon={
                          <Image
                            src={LoanIcon}
                            alt="Dashboard"
                            className={styles.sidebarIcon}
                            width={24}
                            height={24}
                          />
                        }
                        text="Get a Loan"
                      />
                      <QuickActionCard
                        action={() => {}}
                        disabled
                        color="#214CCF"
                        backgroundColor="#E9EDFA"
                        icon={
                          <Image
                            src={WithdrawIcon}
                            alt="Dashboard"
                            className={styles.sidebarIcon}
                            width={24}
                            height={24}
                          />
                        }
                        text="Withdraw Funds"
                      />
                    </div>
                  </div>
                  <div className={styles.quickActionPager} aria-hidden="true">
                    <span
                      className={`${styles.quickActionDot} ${styles.quickActionDotActive}`}
                    />
                    <span className={styles.quickActionDot} />
                  </div>
                </div>
              )}
            </FundAccountFlow>
          )}
        </FundWalletFlow>

        {isTransactions ? (
          <div className={styles.bottomContainer}>
            {/* <BottomLeft showSoloSavings={!accountDetails.hasSoloAccount} /> */}
            <BottomRight
              savingsAccounts={accounts}
              transactions={allTransactions}
            />
          </div>
        ) : (
          <div className={styles.bottomContainerNone}>
            <Image
              src={NoRecord}
              alt="No transactions"
              width={124}
              height={120}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardClient;
