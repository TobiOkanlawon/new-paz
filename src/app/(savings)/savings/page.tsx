"use client";
import React, { useState } from "react";
import styles from "./savings.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import Modal from "@/components/Modal";
import SavingsAlert from "@/components/SavingsAlert";
import { LuCopy } from "react-icons/lu";

const Savings = () => {
  const router = useRouter();
  const [isformBClicked, setisFormBClicked] = useState(false);
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
  const [savingsAlert, setSavingsAlert] = useState(false);
  const [isNewFamily, setIsNewFamily] = useState(true); //After the form is filled set isNewFamily to false
  const [isNewSoloSaver, setIsnewSoloSaver] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const topCards = [
    {
      img: "/soloUser.png",
      header: "PAZ Solo Saver",
      text: "Save money regularly in a locked plan with interest of up to 12% per annum.",
      href: "/soloSaver",
      color: " #3475DF0D",
    },
    {
      img: "/familyVaultCard.png",
      header: "PAZ Family Vault",
      text: "Save money together with your loved ones and get interests of up to 16% per annum.",
      href: "/familyVault",
      color: "#243D7D1A",
    },
  ];

  const FamilyForm = (
    <form className={styles.modalContainer}>
      <h1>PAZ Family Vault</h1>
      <p>Begin your journey to financial freedom</p>
      <label htmlFor="famName">Family name</label>
      <div className={styles.famNameContainer}>
        <input type="text" id="famName" placeholder="Enter your family name" />
      </div>
      <label htmlFor="addFam">Add Family Member</label>
      <div className={styles.addFam}>
        <input
          type="text"
          id="addFam"
          placeholder="Enter family member account name"
        />
        <button>
          <LuCopy /> Copy link
        </button>
      </div>
      <label className={styles.preferredAmountLabel}>
        Select preferred amount
      </label>
      <div className={styles.preferredAmount}>
        <button value={"5000"}>5,000</button>
        <button value={"10000"}>10,000</button>
        <button value={"50000"}>50,000</button>
        <button value={"100000"}>100,000</button>
        <input
          type="number"
          name="preferredAmount"
          id="preferredAmount"
          placeholder="specify amount"
        />
      </div>
      <label htmlFor="savingFrequency">Select Saving Frequency</label>
      <div className={styles.frequentSavings}>
        <select name="savingFrequency" id="savingFrequency">
          <option value="2 months">2 months</option>
          <option value="3 months">3 months</option>
          <option value="4 months">4 months</option>
          <option value="5 months">5 months</option>
          <option value="6 months">6 months</option>
        </select>
      </div>
      <label className={styles.savingsDurationLabel}>
        Select savings duration
      </label>
      <div className={styles.savingsDuration}>
        <button>6 months</button>
        <button>1 year</button>
        <button>2 years</button>
        <button>5 years</button>
        <input
          type="number"
          name="preferredAmount"
          id="preferredAmount"
          placeholder="Specify Duration"
        />
      </div>
      <button
        type="submit"
        className={styles.submitButton}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Create Savings
      </button>
    </form>
  );
  const TargetForm = (
    <form className={styles.modalContainer}>
      <h1>Set-up Your PAZ Target Saver Account</h1>
      <p>Begin your journey to financial freedom</p>
      <label htmlFor="famName">Savings Title*</label>
      <div className={styles.famNameContainer}>
        <input
          type="text"
          id="famName"
          placeholder="What are you saving towards"
        />
      </div>
      <label htmlFor="addFam">Savings Description*</label>
      <div className={styles.addFam}>
        <input
          type="text"
          id="addFam"
          style={{ width: "100%" }}
          placeholder="Tell us about your purpose of this savings"
        />
      </div>
      <label className={styles.preferredAmountLabel}>
        Select preferred amount
      </label>
      <div className={styles.preferredAmount}>
        <button value={"5000"}>5,000</button>
        <button value={"10000"}>10,000</button>
        <button value={"50000"}>50,000</button>
        <button value={"100000"}>100,000</button>
        <input
          type="number"
          name="preferredAmount"
          id="preferredAmount"
          placeholder="specify amount"
        />
      </div>
      <label htmlFor="savingFrequency">Select Saving Frequency</label>
      <div className={styles.frequentSavings}>
        <select name="savingFrequency" id="savingFrequency">
          <option value="2 months">2 months</option>
          <option value="3 months">3 months</option>
          <option value="4 months">4 months</option>
          <option value="5 months">5 months</option>
          <option value="6 months">6 months</option>
        </select>
      </div>
      <label className={styles.savingsDurationLabel}>
        Select savings duration
      </label>
      <div className={styles.savingsDuration}>
        <button>6 months</button>
        <button>1 year</button>
        <button>2 years</button>
        <button>5 years</button>
        <input
          type="number"
          name="preferredAmount"
          id="preferredAmount"
          placeholder="Specify Duration"
        />
      </div>
      <button
        type="submit"
        className={styles.submitButton}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Create Savings
      </button>
    </form>
  );
  return (
    <div className={styles.container}>
      <SavingsAlert
        isActive={savingsAlert}
        isSuccessful={true}
        onClose={() => {
          setSavingsAlert(false);
        }}
        message="Top Up Successful"
      />
      <h2 className={styles.header}>Savings</h2>
      <p className={styles.headingText}>Explore all our savings plans here.</p>
      <TotalBalanceCard header="Total savings" />
      <div className={styles.saversContainer}>
        <div className={styles.topCardSet}>
          {topCards.map((card) => (
            <div
              className={styles.cardTypes}
              key={card.href}
              style={{ backgroundColor: card.color }}
            >
              <Image
                src={card.img}
                alt={card.header}
                width={100}
                height={100}
              />
              <div>
                <h4>{card.header}</h4>
                <p>{card.text}</p>
                <button
                  className={styles.startNowButton}
                  onClick={() => {
                    if (card.href === "/familyVault") {
                      if (isNewFamily) {
                        handleOpenModal("family");
                        setIsNewFamily(false);
                      } else {
                        handleStartClick(`/savings${card.href}`);
                      }
                    } else {
                      handleStartClick(`/savings${card.href}`);
                    }
                  }}
                >
                  Start now
                </button>
              </div>
            </div>
          ))}
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
      {isActive && (
        <Modal isOpen={isActive} onClose={handleCloseModal}>
          modalType === "family" ? FamilyForm : modalType === "target" ?
          TargetForm : null
        </Modal>
      )}
    </div>
  );
};

export default Savings;
