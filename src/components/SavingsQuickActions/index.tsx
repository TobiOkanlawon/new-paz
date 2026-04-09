import React from "react";
import { RiScanLine } from "react-icons/ri";
import { TbArrowsUpDown } from "react-icons/tb";
import { MdOutlineAddCard } from "react-icons/md";
import { HiOutlineLink } from "react-icons/hi";
import Link from "next/link";
import styles from "./Quickactions.module.css";

type ActionBase = {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
};

type ActionWithHref = ActionBase & {
  href: string;
  onClick?: never;
};

type ActionWithFunction = ActionBase & {
  onClick: () => void;
  href?: never;
};

export type QuickActionItem = ActionWithHref | ActionWithFunction;

type Props = {
  actions?: QuickActionItem[];
};


// const defaultActions: QuickActionItem[] = [
//   {
//     id: "fund",
//     label: "Fund Account",
//     icon: <RiScanLine size={22} />,
//     iconBg: "#e8f5e9",
//     iconColor: "#43a047",
//     href: "/dashboard/fund",
//   },
//   {
//     id: "withdraw",
//     label: "Withdraw Funds",
//     icon: <TbArrowsUpDown size={22} />,
//     iconBg: "#ede7f6",
//     iconColor: "#5c6bc0",
//     href: "/dashboard/withdraw",
//   },
//   {
//     id: "debit",
//     label: "Add debit card",
//     icon: <MdOutlineAddCard size={22} />,
//     iconBg: "#fff3e0",
//     iconColor: "#fb8c00",
//     href: "/dashboard/add-card",
//   },
//   {
//     id: "link",
//     label: "Link Account",
//     icon: <HiOutlineLink size={22} />,
//     iconBg: "#e8eaf6",
//     iconColor: "#3949ab",
//     href: "/dashboard/link-account",
//   },
// ];

const QuickActions: React.FC<Props> = ({ actions = [] }) => {
  return (
    <div className={styles.wrapper}>
      {actions.map((action: QuickActionItem) => (
        "href" in action ? (
          <Link key={action.id} href={action.href as string} className={styles.item}>
            <span
              className={styles.iconBox}
              style={{ background: action.iconBg, color: action.iconColor }}
            >
              {action.icon}
            </span>
            <span className={styles.label}>{action.label}</span>
          </Link>
        ) : (
          <button
            key={action.id}
            type="button"
            className={styles.item}
            onClick={action.onClick}
          >
            <span
              className={styles.iconBox}
              style={{ background: action.iconBg, color: action.iconColor }}
            >
              {action.icon}
            </span>
            <span className={styles.label}>{action.label}</span>
          </button>
        )
      ))}
    </div>
  );
};

export default QuickActions;