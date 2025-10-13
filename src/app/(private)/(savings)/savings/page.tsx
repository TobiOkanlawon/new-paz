"use client";
import React, { useEffect, useState } from "react";
import styles from "./savings.module.css";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
import useUser from "@/store/userStore";
import FamilyVaultModal from "@/components/Savings/FamilyVaultModal";
import { useCreateSoloSaver } from "@/data/mutations/useCreateSoloSaver";
import { Loading } from "@/components/Loading";
import { ErrorComponent } from "@/components/Error";
import TargetSavingsModal from "@/components/Savings/TargetSavingsModal";
import SoloUserImage from "@/assets/soloUser.png";
import FamilyVaultCardImage from "@/assets/familyVaultCard.png";
import { addSavings } from "@/libs/helpers";

type Card = {
  color: string;
  href: string;
  header: string;
  img: StaticImageData;
  text: string;
  handleStart: () => void;
};

type CardProps = {
  card: Card;
};

const SavingsCard: React.FC<CardProps> = ({ card }) => {
  return (
    <>
      <div
        className={styles.cardTypes}
        key={card.href}
        style={{ backgroundColor: card.color }}
      >
        <Image src={card.img} alt={card.header} width={100} height={100} />
        <div>
          <h4>{card.header}</h4>
          <p>{card.text}</p>
          <button className={styles.startNowButton} onClick={card.handleStart}>
            Start now
          </button>
        </div>
      </div>
    </>
  );
};

const Savings = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading, error } = useGetAccountDetails(
    user?.email as string,
  );

  const mutation = useCreateSoloSaver(user?.email as string);

  const [modalType, setModalType] = useState<"family" | "target" | null>(null);

  const handleStartClick = (to: string) => {
    router.push(to);
  };

  const handleOpenModal = (type: "family" | "target") => {
    setIsActive(true);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setIsActive(false);
    setModalType(null);
  };

  const [isNewSoloSaver, setIsnewSoloSaver] = useState(true);
  const [isActive, setIsActive] = useState(false);

  const topCards: Card[] = [
    {
      img: SoloUserImage,
      header: "PAZ Solo Saver",
      text: "Save money regularly in a locked plan with interest of up to 12% per annum.",
      href: "/soloSaver",
      color: " #3475DF0D",
      handleStart: () => {},
    },
    {
      img: FamilyVaultCardImage,
      header: "PAZ Family Vault",
      text: "Save money together with your loved ones and get interests of up to 16% per annum.",
      href: "/familyVault",
      color: "#243D7D1A",
      handleStart: () => {},
    },
  ];

  useEffect(() => {
    // this works (tested)
    if (!data?.HasSoloAccount && !isLoading && !mutation.isPending) {
      mutation.mutate({
        title: "PERSONAL",
        description: "Solo saver account",
        currentAmount: 0,
        walletId: user?.wallet_account as string,
        type: "SOLO",
      });
    }
  }, [data?.HasSoloAccount, mutation, user?.wallet_account]);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorComponent
        message="An error occured while trying to create a solo saver account"
        retryFunction={() => {}}
      />
    );

  if (mutation.isPending) {
    return <Loading />;
  }

  if (mutation.isError) {
    return (
      <ErrorComponent
        message="An error occured while trying to create a solo saver account"
        retryFunction={() => {}}
      />
    );
  }

  // the loading state shows in the case that the solo saver account is being created
  if (!data?.HasSoloAccount) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Savings</h2>
      <p className={styles.headingText}>Explore all our savings plans here.</p>
      <TotalBalanceCard money={addSavings(data)} header="Total savings" />
      <div className={styles.saversContainer}>
        <div className={styles.topCardSet}>
          {topCards.map((card) => {
            return <SavingsCard card={card} />;
          })}
        </div>
        <div
          className={styles.cardTypes}
          style={{ backgroundColor: "#3475DF0D" }}
        >
          <Image
            src={"/targetSavingsCard.png"}
            alt="Target Savings Image"
            width={100}
            height={100}
          />
          <div>
            <h4>PAZ Target Saver</h4>
            <p>
              Save money regularly in a locked plan with interest of up to 12%
              per annum.
            </p>
            <button
              className={styles.startNowButton}
              onClick={() => {
                if (isNewSoloSaver) {
                  handleOpenModal("target");
                  setIsnewSoloSaver(false);
                } else {
                  handleStartClick("/savings/targetSavings");
                }
              }}
            >
              Start now
            </button>
          </div>
        </div>
      </div>
      {isActive && modalType === "family" ? (
        <FamilyVaultModal
          isActive={isActive}
          handleCloseModal={handleCloseModal}
        />
      ) : modalType === "target" ? (
        <TargetSavingsModal
          isActive={isActive}
          handleCloseModal={handleCloseModal}
        />
      ) : null}
    </div>
  );
};

export default Savings;
