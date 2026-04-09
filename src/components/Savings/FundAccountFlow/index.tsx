"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import AllAccountsModal from "@/components/Savings/AllAccountsModal";
import TopUpSoloSavingsModal from "@/components/TopUpSoloSavingsModal/TopUpSoloSavingsModal";
import TopUpTransferDetailsModal from "../TopUpDetailsModal";
import { createSavingsTopup } from "@/actions/savings";

type SelectedAccount = {
  type: "solo" | "target";
  accountNo: string;
  title: string;
};

type TopUpDetails = {
  accountName: string;
  accountNumber: string;
  bank: { name: string };
  amount: number;
  displayText: string;
};

type Props = {
  accountSummary: any;
  onCompleted?: (details: TopUpDetails) => void;
  children?: (openFundModal: () => void) => React.ReactNode;
};

const FundAccountFlow = ({ accountSummary, onCompleted, children }: Props) => {
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpDetailsModalOpen, setTopUpDetailsModalOpen] = useState(false);
  const [fundLoading, setFundLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SelectedAccount | null>(
    null
  );
  const [topUpDetails, setTopUpDetails] = useState<TopUpDetails | null>(null);

  const openFundModal = () => {
    setFundModalOpen(true);
  };

  const accountDataForModal = () => {
    return {
      soloSavings: accountSummary.hasSoloAccount
        ? accountSummary.soloSavings
        : undefined,
      targetSavings: accountSummary.targetSavings,
    };
  };

  const handleSelectAccount = (account: SelectedAccount) => {
    setSelectedAccount(account);
    setFundModalOpen(false);
    setTopUpModalOpen(true);
  };

  const handleTopUpConfirm = async ({ amount }: { amount: number }) => {
    if (!selectedAccount) return;

    try {
      setFundLoading(true);
      const result = await createSavingsTopup({
        savingsWallet: selectedAccount.accountNo,
        amount,
      });

      if (result.success) {
        setTopUpModalOpen(false);
        setTopUpDetails(result.data);
        setTopUpDetailsModalOpen(true);
        onCompleted?.(result.data);
      } else {
        toast.error(result.error || "Failed to create topup");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setFundLoading(false);
    }
  };

  const handleCloseAllModals = () => {
    setFundModalOpen(false);
    setTopUpModalOpen(false);
    setTopUpDetailsModalOpen(false);
    setSelectedAccount(null);
    setTopUpDetails(null);
  };

  return (
    <>
      {children?.(openFundModal)}

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
        onClose={() => {
          setTopUpDetailsModalOpen(false);
          handleCloseAllModals();
        }}
        data={topUpDetails}
      />
    </>
  );
};

export default FundAccountFlow;
