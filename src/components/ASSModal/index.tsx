"use client";
import React, { useState } from "react";
import Modal from "../Modal";
import styles from "./assm.module.css";
import Image from "next/image";
import { LuArrowLeft } from "react-icons/lu";

interface ASSMProps {
    isOpen: boolean,
    onClose: () => void,
}
const AccountSetupSuccessModal: React.FC<ASSMProps> = ({isOpen, onClose}) => {
  return (
    <div className={styles.container}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.success}>
          <Image
            src={"/confettiBall.png"}
            alt=""
            height={90}
            width={90}
            className={styles.confetti}
          />
          <h1 className={styles.modalHeader}>Success!</h1>
          <p className={styles.modalDetails}>Your Account has been setup!</p>

          <div className={styles.backContainer} onClick={onClose}>
            <LuArrowLeft />
            <p>Back</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountSetupSuccessModal;
