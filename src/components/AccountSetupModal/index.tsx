import React from "react";
import styles from "./asm.module.css";
import Modal2 from "../Modal2";
import Image from "next/image";
import { LuUserRoundPlus, LuHash } from "react-icons/lu";
import Button from "../Button";
import useUser from "@/store/userStore";

interface ASMProps {
  isOpen: boolean;
  handleBVNMopen: () => void;
  handleACMopen: () => void;
}

const SetupModal: React.FC<ASMProps> = ({
  isOpen,
  handleBVNMopen,
  handleACMopen,
}) => {
  const { user } = useUser();

  // Early return if no user
  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Modal2 isOpen={isOpen}>
        <div className={styles.modalHeader}>
          <h2>Welcome</h2>
          <Image src={"/confettiBall.png"} alt="" width={45} height={45} />
        </div>
        <p className={styles.modalDescription}>
          Just a few more steps to setup your account
        </p>
        <div className={styles.addAccount}>
          <LuUserRoundPlus />
          <p>Add Account</p>
          {user.primary_account_linked ? (
            <p className={styles.success}>Linked</p>
          ) : (
            <Button onClick={handleACMopen} disabled={!user.is_bvn_verified}>
              {user.is_bvn_verified ? "Add Account" : "Please add BVN first"}
            </Button>
          )}
        </div>
        <div className={styles.addBVN}>
          <LuHash />
          <p>Add BVN</p>
          {user.is_bvn_verified ? (
            <p className={styles.success}>Verified</p>
          ) : (
            <Button onClick={handleBVNMopen}>Add BVN</Button>
          )}
        </div>
      </Modal2>
    </div>
  );
};

export default SetupModal;
