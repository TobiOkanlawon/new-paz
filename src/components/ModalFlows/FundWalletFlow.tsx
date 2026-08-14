"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import FundWalletModal from "@/components/FundWalletModal/FundWalletModal";
import TopUpTransferDetailsModal from "@/components/Savings/TopUpDetailsModal";
import { fundWallet } from "@/actions/wallet";

type TopUpDetails = {
  accountName: string;
  accountNumber: string;
  bank: { name: string };
  amount: number;
  displayText: string;
};

type Props = {
  children?: (openFundWalletModal: () => void) => React.ReactNode;
};

const FundWalletFlow = ({ children }: Props) => {
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<TopUpDetails | null>(null);

  const openFundWalletModal = () => {
    setFundModalOpen(true);
  };

  const handleConfirm = async ({ amount }: { amount: number }) => {
    try {
      setLoading(true);
      const result = await fundWallet({ amount });

      if (result.success) {
        setDetails(result.data);
        setDetailsModalOpen(true);
      } else {
        toast.error(result.error || "Failed to fund wallet");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {children?.(openFundWalletModal)}

      <FundWalletModal
        open={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
        loading={loading}
        onConfirm={handleConfirm}
      />

      <TopUpTransferDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setDetails(null);
        }}
        data={details}
      />
    </>
  );
};

export default FundWalletFlow;
