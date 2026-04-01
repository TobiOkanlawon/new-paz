"use client";
import Link from "next/link";
import styles from "./styles.module.css";

import { useState } from "react";

import Rose from "@/assets/noto_rose.svg";
import SavingsPlanMiniCard from "@/components/Savings/SavingsCard";

import CreateTargetSaversModal from "@/components/Savings/CreateTargetSavingsModal";
import CreateSoloSaversModal from "@/components/Savings/CreateSavingsModal";
import {
  createSoloSavingsAccount,
  createTargetSavingsAccount,
} from "@/actions/savings";

import { toast } from "react-toastify";
import { close } from "fs";

type Props = {
  showSoloSavings: boolean;
};

const BottomLeft: React.FC<Props> = ({ showSoloSavings }) => {
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSoloModalOpen, setIsSoloModalOpen] = useState(false);

  const openSoloSavingsModal = () => {
    setIsSoloModalOpen(true);
  };

  const closeSoloSavingsModal = () => {
    setIsSoloModalOpen(false);
  };

  const showTargetSavingsModal = (planName: string) => {
    setSelectedPlan(planName);
    setIsTargetModalOpen(true);
  };

  const closeTargetSavingsModal = () => {
    setIsTargetModalOpen(false);
    setSelectedPlan(null);
  };

  const handleCreateTargetSavings = async (values: any) => {
    const result = await createTargetSavingsAccount(values);

    if (!result.success) {
      toast.error(result.error);
      closeTargetSavingsModal();
      return;
    }

    toast.success("Target savings created successfully!");
    closeTargetSavingsModal();
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
                  action={openSoloSavingsModal}
                />
                <SavingsPlanMiniCard
                  title="Valentine"
                  icon={<Rose height={24} width={24} />}
                  content="Save money daily, bi-weekly plan with a purpose in mind."
                  borderColor="#214CCF"
                  imageBackgroundColor="#E9EDFA"
                  action={openSoloSavingsModal}
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

      <CreateSoloSaversModal
        isOpen={isSoloModalOpen}
        onClose={closeSoloSavingsModal}
        onSubmit={createSoloSavingsAccount}
      />
    </div>
  );
};

export default BottomLeft;
