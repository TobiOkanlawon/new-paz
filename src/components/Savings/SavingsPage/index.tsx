"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./styles.module.css";

import Button from "@/components/Button";
import SavingsPlanMiniCard from "@/components/Savings/SavingsCard";
import SavingsWalletCard from "@/components/Savings/SavingsScreenCard";
import TransactionsTable, {
  TransactionRow,
} from "@/components/TransactionTable/TransactionTable";

import FundAccountModal from "@/components/FundAccountModal/FundAccountModal";
import AllAccountsModal from "@/components/Savings/AllAccountsModal";
import QuickActions from "@/components/SavingsQuickActions";

import { openPaystackPopup } from "@/libs/paystack";
import { getAccountSummary } from "@/actions/dashboard";
import { getTotalBalance } from "@/libs/helpers";
import Image from "next/image";
import Link from "next/link";
import NoRecord from "@/assets/noRecord.png";
import { RiScanLine } from "react-icons/ri";
import { TbArrowsUpDown } from "react-icons/tb";
import { MdOutlineAddCard } from "react-icons/md";
import { HiOutlineLink } from "react-icons/hi";

import Rose from "@/assets/noto_rose.svg";
import Piggy from "@/assets/piggy-bank.svg";
import { toast } from "react-toastify";
import {
  createSavingsTopup,
  createSoloSavingsAccount,
} from "@/actions/savings";
import TopUpSoloSavingsModal from "@/components/TopUpSoloSavingsModal/TopUpSoloSavingsModal";
import TopUpTransferDetailsModal from "../TopUpDetailsModal";
import CreateSoloSaversModal from "@/components/Savings/CreateSavingsModal";

type Props = {
  accountSummary: any;
  rows: any[];
  showFundAccountButton: boolean;
};

const SavingsClient = ({
  accountSummary,
  rows,
  showFundAccountButton,
}: Props) => {
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundLoading, setFundLoading] = useState(false);
  const [soloSaversModalOpen, setSoloSaversModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const accountDataForModal = () => {
    const a: typeof accountSummary = accountSummary;
    return {
      soloSavings: a.hasSoloAccount ? a.soloSavings : undefined,
      targetSavings: a.targetSavings,
    };
  };

  const handleSelectAccount = (account: {
    type: "solo" | "target";
    accountNo: string;
    title: string;
  }) => {
    setSelectedAccount(account);
    setFundModalOpen(false);
    setTopUpModalOpen(true);
  };

  const handleTopUpConfirm = async ({ amount }: { amount: number }) => {
    if (!selectedAccount) return;

    try {
      const result = await createSavingsTopup({
        savingsWallet: selectedAccount.accountNo,
        amount,
      });

      if (result.success) {
        setTopUpModalOpen(false);
        setTopUpDetails(result.data);
        setTopUpDetailsModalOpen(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  const QuickActionItems = [
    {
      id: "fund",
      label: "Fund Account",
      icon: <RiScanLine size={22} />,
      onClick: () => setFundModalOpen(true),
    },
    {
      id: "withdraw",
      label: "Withdraw Funds",
      icon: <TbArrowsUpDown size={22} />,
      href: "/dashboard/withdraw",
    },
    {
      id: "debit",
      label: "Add debit card",
      icon: <MdOutlineAddCard size={22} />,
      href: "/dashboard/add-card",
    },
    {
      id: "link",
      label: "Link Account",
      icon: <HiOutlineLink size={22} />,
      href: "/dashboard/link-account",
    },
  ];

  const showSoloSavers = !accountSummary.hasSoloAccount;

  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpDetailsModalOpen, setTopUpDetailsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{
    type: "solo" | "target";
    accountNo: string;
    title: string;
  } | null>(null);

  const [topUpDetails, setTopUpDetails] = useState<{
    accountName: string;
    accountNumber: string;
    bank: { name: string };
    amount: number;
    displayText: string;
  } | null>(null);

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
        </div>
      </div>

      <div className={styles.midSection}>
        <div className={styles.savingsCard}>
          <SavingsWalletCard
            amount={getTotalBalance(accountSummary, "savings") ?? 0.0}
          />
        </div>
        {showFundAccountButton && (
          <Button
            onClick={() => {
              setFundModalOpen(true);
            }}
            className={styles.fundAccountButton}
          >
            Fund Account
          </Button>
        )}
        <div className={styles.midSectionRight} style={{ display: "none" }}>
          <Button className={styles.outlineButton}>Add Debit Card</Button>
          <Button className={styles.blockButton}>Link Account</Button>
        </div>
      </div>

      <div>
        <QuickActions actions={QuickActionItems as any} />
      </div>

      <div className={styles.savingsPlansContainer}>
        <h2 className={styles.savingsPlanHeader}>Savings Plans</h2>
        <div className={styles.savingsPlanInnerContainer}>
          {showSoloSavers && (
            <SavingsPlanMiniCard
              title="Solo Savers"
              icon={<Piggy color="#214CCF" width={24} height={24} />}
              content="Save money regularly in a locked plan with interest up to 12% per annum."
              borderColor="#214CCF"
              imageBackgroundColor="#E9EDFA"
              showTopRightIcon={false}
              action={() => setSoloSaversModalOpen(true)}
            />
          )}
          <SavingsPlanMiniCard
            title="Target Savers"
            icon={<Rose color="#22C55E" width={24} height={24} />}
            content="Save money regularly in a locked plan with interest up to 12% per annum."
            borderColor="#22C55E"
            imageBackgroundColor="#EBFFF2"
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
      {rows && rows.length > 0 ? (
        <TransactionsTable
          rows={rows}
          total={20}
          page={page}
          pageSize={pageSize}
          onPageChange={() => {}}
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
          <Image
            src={NoRecord}
            alt="No transactions"
            width={124}
            height={120}
          />
        </div>
      )}
      <AllAccountsModal
        open={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
        data={accountDataForModal()}
        onSelect={handleSelectAccount}
      />

      {selectedAccount && (
        <TopUpSoloSavingsModal
          open={topUpModalOpen}
          onClose={() => setTopUpModalOpen(false)}
          accountName={selectedAccount.title}
          currentBalance={
            selectedAccount.type === "solo"
              ? accountSummary.soloSavings.amount
              : (accountSummary.targetSavings.find(
                  (t: any) => t.accountNo === selectedAccount.accountNo,
                )?.amount ?? 0)
          }
          loading={fundLoading}
          onConfirm={handleTopUpConfirm}
        />
      )}
      <TopUpTransferDetailsModal
        open={topUpDetailsModalOpen}
        onClose={() => setTopUpDetailsModalOpen(false)}
        data={topUpDetails}
      />
      <CreateSoloSaversModal
        isOpen={soloSaversModalOpen}
        onClose={() => setSoloSaversModalOpen(false)}
        onSubmit={createSoloSavingsAccount}
      />
    </div>
  );
};

export default SavingsClient;
