"use client";
import SavingsPlanMiniCard from "@/components/Savings/SavingsCard";
import styles from "./card.module.css";

// images
import Rose from "@/assets/noto_rose.svg";
import clsx from "clsx";
import { useState } from "react";
import CreateSoloSaversModal from "@/components/Savings/CreateSavingsModal";
import { createSoloSavingsAccount } from "@/actions/savings";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
// import Valentine from "../assets/Valentine.png";
// import Christmas from "../assets/Christmas.png";
// import Wigs from "../assets/Wigs.png";
// import Bags from "../assets/Bags.png";
// import Vacation from "../assets/Vacation.png";
// import Car from "../assets/Car.png";
// import Rent from "../assets/Rent.png";
// import School from "../assets/School.png";
// import Relocation from "../assets/Relocation.png";
// import BuyHouse from "../assets/BuyHouse.png";
// import Land from "../assets/Land.png";
// import Misc from "../assets/Misc.png";

type Props = {
  showSoloSavers: boolean;
};

export default function SavingsPlans({ showSoloSavers }: Props) {
  const soloSavings = [
    {
      title: "Valentine",
      image: Rose,
      borderColor: "#F43F5E",
    },
    {
      title: "Christmas",
      image: Rose,
      borderColor: "#22C55E",
    },
    {
      title: "Wigs",
      image: Rose,
      borderColor: "#A855F7",
    },
    {
      title: "Bags",
      image: Rose,
      borderColor: "#F59E0B",
    },
  ];

  const targetSavings = [
    {
      title: "Vacation",
      image: Rose,
      borderColor: "#F59E0B",
    },
    {
      title: "Car",
      image: Rose,
      borderColor: "#EC4899",
    },
    {
      title: "House Rent",
      image: Rose,
      borderColor: "#A855F7",
    },
    {
      title: "School Fees",
      image: Rose,
      borderColor: "#22C55E",
    },
  ];

  const familyVault = [
    {
      title: "Relocation",
      image: Rose,
      borderColor: "#22C55E",
    },
    {
      title: "Buy House",
      image: Rose,
      borderColor: "#3B82F6",
    },
    {
      title: "Land",
      image: Rose,
      borderColor: "#F59E0B",
    },
    {
      title: "Miscellaneous",
      image: Rose,
      borderColor: "#EC4899",
    },
  ];

  const loans = [
    {
      title: "Business Loan",
      image: Rose,
      borderColor: "#A855F7",
    },
    {
      title: "PAZ Loan",
      image: Rose,
      borderColor: "#F59E0B",
    },
    {
      title: "Rent Loan",
      image: Rose,
      borderColor: "#EC4899",
    },
    {
      title: "Car Loan",
      image: Rose,
      borderColor: "#22C55E",
    },
  ];

  const investments = [
    {
      title: "Vacation",
      image: Rose,
      borderColor: "#F59E0B",
    },
    {
      title: "Car Loan",
      image: Rose,
      borderColor: "#22C55E",
    },
    {
      title: "Business Loan",
      image: Rose,
      borderColor: "#A855F7",
    },
    {
      title: "Buy House",
      image: Rose,
      borderColor: "#3B82F6",
    },
  ];

  const [isSoloSaverModalVisible, setIsSoloSaversModalVisible] =
    useState(false);

  const [isTargetSaverModalVisible, setIsTargetSaversModalVisible] =
    useState(false);

  const showCreateSoloSaversModal = () => {
    setIsSoloSaversModalVisible(true);
  };

  const showCreateTargetSaversModal = () => {
    setIsTargetSaversModalVisible(true);
  };

  const description =
    "Save money daily, bi-weekly plan with a purpose in mind.";

  const renderCards = (items, type: "solo" | "target") => {
    let action;
    if (type == "solo") {
      action = showCreateSoloSaversModal;
    } else if (type == "target") {
      action = showCreateTargetSaversModal;
    }

    return items.map((item, index) => (
      <SavingsPlanMiniCard
        key={index}
        title={item.title}
        icon={item.image}
        content={description}
        borderColor={item.borderColor}
        imageBackgroundColor="#E9EDFA"
        showTopRightIcon={false}
        action={() => action()}
      />
    ));
  };

  const router = useRouter();

  const createSoloSaversAction = async (values: {
    accountName: string;
    initialDeposit: number;
    contributionFrequency: string;
    contributionAmount: number;
  }) => {
    const result = await createSoloSavingsAccount({
      accountName: values.accountName,
    });
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Savings Plan created");
    setIsSoloSaversModalVisible(false);
    router.push("/dashboard/savings/solo-saver");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <h2 className="text-lg font-semibold mb-6">Savings Plans</h2>

      <div className={styles.container}>
        {/* Solo Savings */}
        {showSoloSavers && (
          <Section title="Solo Savings">
            {renderCards(soloSavings, "solo")}
          </Section>
        )}

        {/* Target Savings */}
        <Section title="Target Savings">
          {renderCards(targetSavings, "target")}
        </Section>

        {/* Family Vault
        <Section title="Family Vault Savings">
          {renderCards(familyVault)}
        </Section> */}

        {/* Loans
        <Section title="Loans (Coming Soon)">{renderCards(loans)}</Section>
         */}

        {/* Investments
        <Section title="Investments (Coming Soon)">
          {renderCards(investments)}
        </Section>
           */}
      </div>
      <CreateSoloSaversModal
        title="Create your Solo Savers Plan"
        isOpen={isSoloSaverModalVisible}
        onClose={() => setIsSoloSaversModalVisible(false)}
        onSubmit={createSoloSaversAction}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h3 className="text-sm font-semibold text-gray-600 mb-4">{title}</h3>

      <div className={styles.innerContainer}>{children}</div>
    </div>
  );
}
