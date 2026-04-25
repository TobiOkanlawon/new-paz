"use client";

import ModalShell from "@/components/ModalShell/ModalShell";
import styles from "./styles.module.css";
import { FiChevronRight } from "react-icons/fi";
import { RiBankLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import Link from "next/link";
import Button from "@/components/Button";

type SoloSavings = {
  title: string;
  description: string;
  targetAmount: number;
  accountNo: string;
  amount: number;
};

type TargetSavings = {
  title: string;
  description: string;
  targetAmount: number;
  accountNo: string;
  amount: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: {
    soloSavings?: SoloSavings;
    targetSavings?: TargetSavings[];
  };
  onSelect: (account: {
    type: "solo" | "target";
    accountNo: string;
    title: string;
  }) => void;
};

const EmptyModalAllAccountsModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <ModalShell open={open} onClose={onClose} title="Fund Account">
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <p className={styles.emptyText}>
            You don't have any current savings plans
          </p>
          <Link href="/dashboard/savings/create">
            <Button>Create a savings plan</Button>
          </Link>
        </div>
      </div>
    </ModalShell>
  );
};

const AllAccountsModal = ({ open, onClose, data, onSelect }: Props) => {
  const { soloSavings, targetSavings } = data;

  if (!soloSavings && !targetSavings) {
    // when the targetSavings is not created, it is null
    return <EmptyModalAllAccountsModal open={open} onClose={onClose} />;
  }

  return (
    <ModalShell open={open} onClose={onClose} title="Fund Account">
      <div className={styles.container}>
        {/* Solo Saver */}
        {soloSavings && (
          <div
            className={styles.card}
            onClick={() =>
              onSelect({
                type: "solo",
                accountNo: soloSavings.accountNo,
                title: soloSavings.title,
              })
            }
          >
            <div className={styles.left}>
              <div className={`${styles.iconWrapper} ${styles.blue}`}>
                <RiBankLine size={20} />
              </div>

              <div>
                <p className={styles.label}>Solo Savers</p>
                <p className={styles.title}>
                  {soloSavings.title}:{" "}
                  <span className={styles.account}>
                    SA{soloSavings.accountNo}
                  </span>
                </p>
              </div>
            </div>

            <FiChevronRight className={styles.chevron} />
          </div>
        )}

        {/* Target Savers */}
        {targetSavings?.map((item, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() =>
              onSelect({
                type: "target",
                accountNo: item.accountNo,
                title: item.title || item.description,
              })
            }
          >
            <div className={styles.left}>
              <div className={`${styles.iconWrapper} ${styles.green}`}>
                <TbTargetArrow size={20} />
              </div>

              <div>
                <p className={styles.label}>Target Savers</p>
                <p className={styles.title}>
                  {(item.title || item.description) + ":"}{" "}
                  <span className={styles.account}>SA{item.accountNo}</span>
                </p>
              </div>
            </div>

            <FiChevronRight className={styles.chevron} />
          </div>
        ))}
      </div>
    </ModalShell>
  );
};

export default AllAccountsModal;
