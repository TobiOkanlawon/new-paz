"use client";
import Link from "next/link";
import styles from "./styles.module.css";

import { useState } from "react";

import Rose from "@/assets/noto_rose.svg";
import SavingsPlanMiniCard from "@/components/Savings/SavingsCard";

import CreateTargetSaversModal from "@/components/Savings/CreateTargetSavingsModal";
import { createTargetSavingsAccount } from "@/actions/savings";

import { toast } from "react-toastify";

type Props = {
  showSoloSavings: boolean;
};

const BottomLeft: React.FC<Props> = ({ showSoloSavings }) => {
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const showTargetSavingsModal = (planName: string) => {
    setSelectedPlan(planName);
    setIsTargetModalOpen(true);
  };

  const closeTargetSavingsModal = () => {
    setIsTargetModalOpen(false);
    setSelectedPlan(null);
  };

  const handleCreateTargetSavings = async (values: any) => {
    try {
      const result = await createTargetSavingsAccount(values);

      if (result.status === "error") {
        throw new Error(result.error);
      }

      toast.success("Target savings created successfully!");
      closeTargetSavingsModal();
    } catch (e: any) {
      toast.error(e.message || "Failed to create target savings plan");
    }
  };

  return (
    <div className={styles.bottomLeftContainer}>
      <div className={styles.savingsPlan}>
        <div className={styles.savingsPlansTitleContainer}>
          <h2>Savings Plans</h2>
          <Link style={{ color: "#214CCF" }} href="/dashboard/savings/create">
            View All
          </Link>
        </div>

        {showSoloSavings && (
          <div className={styles.savingsPlanInnerContainer}>
            <div className={styles.savingsPlanInnerContainerLine}>
              <h3>Solo Savings</h3>
              <div className={styles.miniCards}>
                <SavingsPlanMiniCard
                  title="Valentine"
                  icon={<Rose height={24} width={24} />}
                  content="Save money daily, bi-weekly plan with a purpose in mind."
                  borderColor="#214CCF"
                  imageBackgroundColor="#E9EDFA"
                />
                <SavingsPlanMiniCard
                  title="Valentine"
                  icon={<Rose height={24} width={24} />}
                  content="Save money daily, bi-weekly plan with a purpose in mind."
                  borderColor="#214CCF"
                  imageBackgroundColor="#E9EDFA"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.savingsPlanInnerContainer}>
        <div className={styles.savingsPlanInnerContainerLine}>
          <h3>Target Savings</h3>
          <div className={styles.miniCards}>
            <SavingsPlanMiniCard
              title="Vacation"
              icon={<Rose height={24} width={24} />}
              content="Save money daily, bi-weekly plan with a purpose in mind."
              borderColor="#214CCF"
              imageBackgroundColor="#E9EDFA"
              action={() => showTargetSavingsModal("Vacation")}
            />
            <SavingsPlanMiniCard
              title="Christmas"
              icon={<Rose height={24} width={24} />}
              content="Save money daily, bi-weekly plan with a purpose in mind."
              borderColor="#22C55E"
              imageBackgroundColor="#EBFFF2"
              action={() => showTargetSavingsModal("Christmas")}
            />
          </div>
        </div>
      </div>
      <CreateTargetSaversModal
        title={`${selectedPlan} savings`}
        isOpen={isTargetModalOpen}
        onClose={closeTargetSavingsModal}
        onSubmit={handleCreateTargetSavings}
      />
    </div>
  );
};

export default BottomLeft;
