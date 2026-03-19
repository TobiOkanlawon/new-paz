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

import Link from "next/link";

import { RiScanLine } from "react-icons/ri";
import { TbArrowsUpDown } from "react-icons/tb";
import { MdOutlineAddCard } from "react-icons/md";
import { HiOutlineLink } from "react-icons/hi";

import Rose from "@/assets/noto_rose.svg";
import Piggy from "@/assets/piggy-bank.svg";

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
  const { data: session } = useSession();

  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundLoading, setFundLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const allAccounts = () => {
    const a: TAccountDetails = accountSummary;

    return [a.soloSavings, ...a.targetSavings, a.familyVault];
  };

  const handleFundAccount = async ({ amount }: { amount: number }) => {
    const email = session?.user?.email;
    if (!email) return;

    setFundLoading(true);

    try {
      await openPaystackPopup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email,
        amount: amount * 100,
        ref: new Date().getTime().toString(),

        onSuccess: async () => {
          setFundModalOpen(false);
          setFundLoading(false);

          const result = await getAccountSummary(email);

          if (result.success) {
            const newBalance = getTotalBalance(result.data, "savings");
            setAmount(newBalance);
          }
        },

        onClose: () => {
          setFundLoading(false);
        },
      });
    } catch (err) {
      console.error(err);
      setFundLoading(false);
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
        <QuickActions actions={QuickActionItems} />
      </div>

      <div className={styles.savingsPlansContainer}>
        <h2>Savings Plans</h2>
        <div className={styles.savingsPlanInnerContainer}>
          {showSoloSavers && (
            <SavingsPlanMiniCard
              title="Solo Savers"
              icon={<Piggy color="#214CCF" width={24} height={24} />}
              content="Save money regularly in a locked plan with interest up to 12% per annum."
              borderColor="#214CCF"
              imageBackgroundColor="#E9EDFA"
              showTopRightIcon={false}
              action={showCreateSoloSaversModal}
            />
          )}
          <SavingsPlanMiniCard
            title="Target Savers"
            icon={<Rose color="#22C55E" width={24} height={24} />}
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
      <AllAccountsModal
        accounts={allAccounts()}
        open={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
      />
      <FundAccountModal
        open={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
        loading={fundLoading}
        onFund={handleFundAccount}
      />
    </div>
  );
};

export default SavingsClient;
