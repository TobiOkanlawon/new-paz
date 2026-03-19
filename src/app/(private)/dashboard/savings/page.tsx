// "use server";
// import styles from "./savings.module.css";
// import Button from "@/components/Button";
// import SavingsPlanMiniCard from "@/components/Savings/SavingsCard";
// import { RiScanLine } from "react-icons/ri";
// import { TbArrowsUpDown } from "react-icons/tb";
// import { MdOutlineAddCard } from "react-icons/md";
// import { HiOutlineLink } from "react-icons/hi";
// import Rose from "@/assets/noto_rose.svg";
// import Piggy from "@/assets/piggy-bank.svg";
// import SavingsWalletCard from "@/components/Savings/SavingsScreenCard";
// import TransactionsTable, {
//   TransactionRow,
// } from "@/components/TransactionTable/TransactionTable";

// import { getAccountSummary } from "@/actions/dashboard";
// import { getTotalBalance } from "@/libs/helpers";
// import Link from "next/link";
// import FundAccountModal from "@/components/FundAccountModal/FundAccountModal";
// import AllAccountsModal from "@/components/Savings/AllAccountsModal";

// import { openPaystackPopup } from "@/libs/paystack";
// import { useSession } from "next-auth/react";
// import QuickActions from "@/components/SavingsQuickActions";

// const Savings = async () => {
//   const rows: TransactionRow[] = [
//     {
//       id: "1",
//       savingsName: "vacation savings",
//       amountTarget: 200000,
//       savingsAmount: 50000,
//       savingsInterest: "12%",
//       amountDebited: 50000,
//       dateDebited: "Mon, 21 Dec 2025",
//       status: "Success",
//     },
//     {
//       id: "2",
//       savingsName: "vacation savings",
//       amountTarget: 200000,
//       savingsAmount: 50000,
//       savingsInterest: "12%",
//       amountDebited: 50000,
//       dateDebited: "Mon, 21 Dec 2025",
//       status: "Pending",
//     },
//     {
//       id: "3",
//       savingsName: "vacation savings",
//       amountTarget: 200000,
//       savingsAmount: 50000,
//       savingsInterest: "12%",
//       amountDebited: 50000,
//       dateDebited: "Mon, 21 Dec 2025",
//       status: "Success",
//     },
//     {
//       id: "4",
//       savingsName: "vacation savings",
//       amountTarget: 200000,
//       savingsAmount: 50000,
//       savingsInterest: "12%",
//       amountDebited: 50000,
//       dateDebited: "Mon, 21 Dec 2025",
//       status: "Success",
//     },
//     {
//       id: "5",
//       savingsName: "vacation savings",
//       amountTarget: 200000,
//       savingsAmount: 50000,
//       savingsInterest: "12%",
//       amountDebited: 50000,
//       dateDebited: "Mon, 21 Dec 2025",
//       status: "Success",
//     },
//     {
//       id: "6",
//       savingsName: "vacation savings",
//       amountTarget: 200000,
//       savingsAmount: 50000,
//       savingsInterest: "12%",
//       amountDebited: 50000,
//       dateDebited: "Mon, 21 Dec 2025",
//       status: "Success",
//     },
//   ];

//   const result = await getAccountSummary();

//   if (!result.success) {
//     return "Error while fetching account summary";
//   }

//   const hasSoloAccount = result.data.hasSoloAccount;
//   // targetSavings can be both null and an empty array. The double bang covers both cases.
//   const hasTargetSavings = !!result.data.targetSavings;
//   const hasFamilyVault = !!result.data.familyVault;

//   const showFundAccountButton =
//     hasSoloAccount || hasTargetSavings || hasFamilyVault;

//   const page = 1;
//   const pageSize = 8;

//   const [fundModalOpen, setFundModalOpen] = useState(false);
//   const [fundLoading, setFundLoading] = useState(false);

//   const [isSoloSaverVisible, setIsSoloSaversVisible] = useState(false);

//   const showCreateSoloSaversModal = () => {
//     setIsSoloSaversVisible(true);
//   };

//   const allAccounts = () => {
//     if (accountSummary == {}) {
//       return {};
//     }

//     return {
//       soloSavings: accountSummary.soloSavings,
//       targetSavings: accountSummary.targetSavings,
//       familySavings: accountSummary.familySavings,
//     };
//   };

//   const handleFundAccount = async ({ amount }: { amount: number }) => {
//     const email = session?.user?.email;

//     if (!email) {
//       return;
//     }

//     setFundLoading(true);

//     try {
//       await openPaystackPopup({
//         key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
//         email,
//         amount: amount * 100,
//         ref: new Date().getTime().toString(),
//         onSuccess: (reference) => {
//           // console.log("Payment successful:", reference);
//           setFundModalOpen(false);
//           setFundLoading(false);

//           void (async () => {
//             try {
//               let email = "";
//               const result = await getAccountSummary(email);
//               if (result.success) {
//                 const balance = getTotalBalance(result.data, "savings");
//                 setAmount(balance.toFixed(2));
//               }
//             } catch (err) {
//               console.error(err);
//             }
//           })();
//         },
//         onClose: () => {
//           console.log("Payment closed");
//           setFundLoading(false);
//         },
//       });
//     } catch (err) {
//       console.error("Paystack error:", err);
//       setFundLoading(false);
//     }
//   };

//   const showSoloSavers = !accountSummary.hasSoloAccount;

//   const QuickActionItems = [
//     {
//       id: "fund",
//       label: "Fund Account",
//       icon: <RiScanLine size={22} />,
//       iconBg: "#e8f5e9",
//       iconColor: "#43a047",
//       onClick: () => setFundModalOpen(true),
//     },
//     {
//       id: "withdraw",
//       label: "Withdraw Funds",
//       icon: <TbArrowsUpDown size={22} />,
//       iconBg: "#ede7f6",
//       iconColor: "#5c6bc0",
//       href: "/dashboard/withdraw",
//     },
//     {
//       id: "debit",
//       label: "Add debit card",
//       icon: <MdOutlineAddCard size={22} />,
//       iconBg: "#fff3e0",
//       iconColor: "#fb8c00",
//       href: "/dashboard/add-card",
//     },
//     {
//       id: "link",
//       label: "Link Account",
//       icon: <HiOutlineLink size={22} />,
//       iconBg: "#e8eaf6",
//       iconColor: "#3949ab",
//       href: "/dashboard/link-account",
//     },
//   ];

//   return (
//     <div className={styles.container}>
//       <div className={styles.heading}>
//         <div className={styles.headingLeft}>
//           <h1 className={styles.firstNameText}>Savings</h1>
//           <p className={styles.subHeadingText}>
//             Explore all of our savings plans here
//           </p>
//         </div>
//         <div className={styles.headingRight}>
//           <Link href="/dashboard/savings/create">
//             <Button className={styles.outlineButton}>Create Savings</Button>
//           </Link>
//           <Button className={styles.outlineButton}>Withdraw Funds</Button>

//           {showFundAccountButton && (
//             <Button
//               onClick={() => {
//                 setFundModalOpen(true);
//               }}
//             >
//               Fund Account
//             </Button>
//           )}
//         </div>
//       </div>

//       <div className={styles.midSection}>
//         <div className={styles.savingsCard}>
//           <SavingsWalletCard amount={parseFloat(amount)} />
//         </div>
//         <div className={styles.midSectionRight} style={{ display: "none" }}>
//           <Button className={styles.outlineButton}>Add Debit Card</Button>
//           <Button className={styles.blockButton}>Link Account</Button>
//         </div>
//       </div>

//       <div>
//         <QuickActions actions={QuickActionItems} />
//       </div>

//       <div className={styles.savingsPlansContainer}>
//         <h2>Savings Plans</h2>
//         <div className={styles.savingsPlanInnerContainer}>
//           {showSoloSavers && (
//             <SavingsPlanMiniCard
//               title="Solo Savers"
//               icon={<Piggy color="#214CCF" width={24} height={24} />}
//               content="Save money regularly in a locked plan with interest up to 12% per annum."
//               borderColor="#214CCF"
//               imageBackgroundColor="#E9EDFA"
//               showTopRightIcon={false}
//               action={showCreateSoloSaversModal}
//             />
//           )}
//           <SavingsPlanMiniCard
//             title="Target Savers"
//             icon={<Rose color="#22C55E" width={24} height={24} />}
//             content="Save money regularly in a locked plan with interest up to 12% per annum."
//             borderColor="#22C55E"
//             imageBackgroundColor="#E9EDFA"
//             showTopRightIcon={false}
//           />
//           {/*<SavingsPlanMiniCard
//             title="Family Vault"
//             image={Rose}
//             content="Save money daily, bi-weekly plan with a purpose in mind."
//             borderColor="#214CCF"
//             imageBackgroundColor="#E9EDFA"
//             showTopRightIcon={false}
//             />*/}
//         </div>
//       </div>
//       <TransactionsTable
//         rows={rows}
//         total={20}
//         page={page}
//         pageSize={pageSize}
//         onPageChange={() => {}}
//         onPageSizeChange={(s) => {
//           // setPageSize(s);
//           // setPage(1);
//         }}
//         showFilter={false}
//         leftControls={
//           <select className={styles.tableControl}>
//             <option>Transaction status</option>
//             <option>Success</option>
//             <option>Pending</option>
//           </select>
//         }
//         rightControls={
//           <div className={styles.tableRightControls}>
//             <button className={styles.tableControlButton}>Filters</button>
//             <button className={styles.tableControlButton}>
//               Wed, 3 Sept, 2024 - Sat, 5 Sept, 2024
//             </button>
//           </div>
//         }
//       />
//       <AllAccountsModal
//         accounts={allAccounts()}
//         open={fundModalOpen}
//         onClose={() => setFundModalOpen(false)}
//       />
//       <FundAccountModal
//         open={fundModalOpen}
//         onClose={() => setFundModalOpen(false)}
//         loading={fundLoading}
//         onFund={handleFundAccount}
//       />
//     </div>
//   );
// };

// export default Savings;

// app/dashboard/savings/page.tsx
import { getAccountSummary } from "@/actions/dashboard";
import SavingsClient from "@/components/Savings/SavingsPage";

const Savings = async () => {
  const rows = [
    {
      id: "1",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "2",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Pending",
    },
    {
      id: "3",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "4",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "5",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "6",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
  ];

  const result = await getAccountSummary();

  if (!result.success) {
    return "Error while fetching account summary";
  }

  const accountSummary = result.data;

  const hasSoloAccount = accountSummary.hasSoloAccount;
  const hasTargetSavings = !!accountSummary.targetSavings;
  const hasFamilyVault = !!accountSummary.familyVault;

  const showFundAccountButton =
    hasSoloAccount || hasTargetSavings || hasFamilyVault;

  return (
    <SavingsClient
      rows={rows}
      accountSummary={accountSummary}
      showFundAccountButton={showFundAccountButton}
    />
  );
};

export default Savings;
