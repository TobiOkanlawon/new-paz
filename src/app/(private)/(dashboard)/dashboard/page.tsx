"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import Image from "next/image";
import CardScrollIndicator from "@/components/CardScrollIndicator";
import BVNModal from "@/components/BVNModal";
import AccountModal from "@/components/AddAccount";
import SetupModal from "@/components/AccountSetupModal";
import AccountSetupSuccessModal from "@/components/ASSModal";
import { useAddBVN } from "@/data/mutations/useAddBVN";
import useUser from "@/store/userStore";
import { toast } from "react-toastify";
import { AccountCard } from "@/components/Dashboard/AccountCard/index";
// import DashboardSavings from "@/assets/images/dashboardSavings.png";
// import DashboardLoans from "@/assets/images/dashboardLoan.png";
// import DashboardInvestments from "@/assets/images/dashboardInvestment.png";
import { useGetProfile } from "@/data/queries/useGetProfile";
import { Loading } from "@/components/Loading";
import { ErrorComponent } from "@/components/Error";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";

const Dashboard = () => {
  const user = useUser((state) => state.user) as TUser;
  const { setUser } = useUser();

  // Refs for scrollable containers
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileSavingVaultRef = useRef<HTMLDivElement>(null);

  // Set the number of cards for each scrollable section
  const mobileScrollCards = 3; // Adjust if you have more/less cards
  const mobileVaultCards = 2; // Adjust if you have more/less vault cards

  // Eye toggle state for each card
  const [showSavings, setShowSavings] = useState(true);
  const [showLoans, setShowLoans] = useState(true);
  const [showInvestments, setShowInvestments] = useState(true);

  // All My Modal States
  const [isSModalOpen, setIsSModalOpen] = useState(true);
  const [isASSModalOpen, setIsASSModalOpen] = useState(false);
  const [isACModalOpen, setIsACModalOpen] = useState(false);
  const [isBVNModalOpen, setIsBVNModalOpen] = useState(false);

  const router = useRouter();

  const mutation = useAddBVN();

  // BVN Modal Form handle submit
  const handleSubmit = (values: { bvn: string; dob: string }) => {
    if (!user?.email) {
      // if this case actually gets hit then there's a problem.
      // We might need to consider logs or something of that sort
      toast.error("User email is missing.");
      return;
    }

    mutation.mutate(
      { ...values, email: user.email },
      {
        onSuccess: () => {
          // set user to all of user but the bvn is verified
          setUser({ is_bvn_verified: true });
        },
      },
    );
    setIsBVNModalOpen(false)
  };

  const handleBVNMOpen = () => setIsBVNModalOpen(true);

  const handleACMOpen = () => setIsACModalOpen(true);

  const [isSavingsAmountVisible, setIsSavingsAmountVisible] = useState(true);
  const [isLoansAmountVisible, setIsLoansAmountVisible] = useState(true);
  const [isInvestmentsAmountVisible, setIsInvestmentsAmountVisible] =
    useState(true);

  const { data, error, isLoading } = useGetAccountDetails(user.email);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorComponent
        message="An error occured while trying to fetch your profile"
        retryFunction={() => {}}
      />
    );

  return (
    <>
      <div className={styles.container}>
        <div className={styles.totals}>
          <AccountCard
            title="Total Savings"
            amount={data?.TotalSavings as number}
            isAmountVisible={isSavingsAmountVisible}
            cornerImage={'/dashboardSavings.png'}
            className={styles.lightBlue}
            toggleAmountVisibility={() =>
              setIsSavingsAmountVisible(!isSavingsAmountVisible)
            }
          />
          <AccountCard
            title="Total Loans Collected"
            amount={data?.TotalLoan as number}
            isAmountVisible={isLoansAmountVisible}
            cornerImage={'/dashboardLoan.png'}
            className={styles.darkBlue}
            toggleAmountVisibility={() =>
              setIsLoansAmountVisible(!isLoansAmountVisible)
            }
          />
          <AccountCard
            title="Total Investments"
            amount={data?.investmentAmount as number}
            isAmountVisible={isInvestmentsAmountVisible}
            cornerImage={'/dashboardInvestment.png'}
            className={styles.purple}
            toggleAmountVisibility={() =>
              setIsInvestmentsAmountVisible(!isInvestmentsAmountVisible)
            }
          />
        </div>
        <div className={styles.savingsActivities}>
          <div className={styles.savingsVault}>
            <div className={styles.personalSavings}>
              <Image
                src="/dashboardLock.png"
                alt="Dashboard Lock"
                width={50}
                height={50}
              />
              <div className={styles.personalSavingsText}>
                <h3>Become a PAZ Saver!</h3>
                <p>
                  Start saving today and stand a chance to earn up to 12% per
                  annum.
                </p>
              </div>
              <button
                className={styles.loanAndInvestmentButton}
                onClick={() => router.push("/savings")}
              >
                Get Started!
              </button>
            </div>
            <div className={styles.familyVault}>
              <Image
                src="/dashboardFamily.png"
                alt="Dashboard Family"
                width={50}
                height={50}
              />
              <div className={styles.familyVaultText}>
                <h3>PAZ Family Vault</h3>
                <p>
                  Start saving with your family members today and stand a chance
                  to earn higher returns annually
                </p>
              </div>
              <button
                className={styles.loanAndInvestmentButton}
                onClick={() => router.push("/savings/familyVault")}
              >
                Get Started!
              </button>
            </div>
            <div className={styles.activities}>
              <h5>Recent activitiy</h5>
              <div className={styles.activitiesList}>
                <h4>
                  <Image
                    src="/activityLogo.png"
                    alt="Activity Logo"
                    width={30}
                    height={30}
                  />
                  PAZ family vault created
                </h4>
                <p>2:45pm</p>
              </div>
              <div className={styles.activitiesList}>
                <h4>
                  <Image
                    src="/activityLogo.png"
                    alt="Activity Logo"
                    width={30}
                    height={30}
                  />
                  Money withdrawn from savings
                </h4>
                <h6>₦ 50,000</h6>
                <p>2 days ago</p>
              </div>
            </div>
          </div>
          <div className={styles.loansAndInvestment}>
            <div className={styles.loanCard}>
              <h3>Avoid Embarrassing Emergencies. Get a Quick Loan today!</h3>
              <button
                className={styles.loanAndInvestmentButton}
                onClick={() => router.push("/loans")}
              >
                Get Loan
              </button>
              <Image src="/loan.png" alt="Get Loan" width={288} height={94} />
            </div>
            <div className={styles.investments}>
              <h3>Secure Your Future Today with PAZ’s Investment Options</h3>
              <p>
                Edge your funds against inflation and devaluation with our
                secure treasury instruments.
              </p>
              <button
                className={styles.loanAndInvestmentButton}
                onClick={() => router.push("/investments")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mobileContainer}>
        {/* <h1>
          Welcome <strong>Biodun</strong>
        </h1> */}
        <div className={styles.mobileScrollWrapper}>
          <div className={styles.mobileScroll} ref={mobileScrollRef}>
            <div className={styles.mobileTotals}>
              <div
                className={`${styles.mobileTotalCategories} ${styles.lightBlue}`}
              >
                <div className={styles.textIcon}>
                  <p>Total Savings</p>
                  <Image
                    src="/dashboardSavings.png"
                    alt="Dashboard Savings"
                    width={40}
                    height={40}
                  />
                </div>
                <h3>
                  ₦ 0.00{" "}
                  <Image
                    src="/eyeOff.png"
                    alt="eyes off"
                    width={20}
                    height={20}
                  />
                </h3>
              </div>
              <div
                className={`${styles.mobileTotalCategories} ${styles.darkBlue}`}
              >
                <div className={styles.textIcon}>
                  <p>Total Loans Collected</p>
                  <Image
                    src="/dashboardLoan.png"
                    alt="Dashboard Loan"
                    width={40}
                    height={40}
                  />
                </div>
                <h3>
                  ₦ 0.00{" "}
                  <Image
                    src="/eyeOff.png"
                    alt="eyes off"
                    width={20}
                    height={20}
                  />
                </h3>
              </div>
              <div
                className={`${styles.mobileTotalCategories} ${styles.purple}`}
              >
                <div className={styles.textIcon}>
                  <p>Total Investments</p>
                  <Image
                    src="/dashboardInvestment.png"
                    alt="Dashboard Investment"
                    width={40}
                    height={40}
                  />
                </div>
                <h3>
                  ₦ 0.00{" "}
                  <Image
                    src="/eyeOff.png"
                    alt="eyes off"
                    width={20}
                    height={20}
                  />
                </h3>
              </div>
            </div>
          </div>

          <CardScrollIndicator
            totalCards={mobileScrollCards}
            containerRef={mobileScrollRef}
          />
        </div>
        <div className={styles.mobileBankActions}>
          <div className={styles.bankActions}>
            <Image
              src="/mobileSavings.png"
              alt="Mobile Savings"
              width={40}
              height={40}
            />
          </div>
          <div className={styles.bankActions}>
            <Image
              src="/mobileLoans.png"
              alt="Mobile Loans"
              width={40}
              height={40}
            />
          </div>
          <div className={styles.bankActions}>
            <Image
              src="/mobileInvestments.png"
              alt="Mobile Investments"
              width={40}
              height={40}
            />
          </div>
          <div className={styles.bankActions}>
            <Image
              src="/mobileThrifts.png"
              alt="Mobile Thrifts"
              width={40}
              height={40}
            />
          </div>
        </div>
        <div className={styles.vaultWrapper}>
          <div className={styles.mobileSavingVault} ref={mobileSavingVaultRef}>
            <div className={styles.pazSaver}>
              <div className={styles.header}>
                <Image
                  src="/dashboardLock.png"
                  alt="Dashboard Lock"
                  width={40}
                  height={38}
                />
                <h3>Become a PAZ Saver!</h3>
              </div>
              <p>
                Start saving today and stand a chance to earn up to 12% per
                annum.
              </p>
              <button
                className={`${styles.mobileButton}`}
                onClick={() => router.push("/savings")}
              >
                Get started!
              </button>
            </div>
            <div className={`${styles.mobileFamilyVault} ${styles.purple}`}>
              <div className={styles.header}>
                <Image
                  src="/dashboardFamily.png"
                  alt="Dashboard Family"
                  width={40}
                  height={38}
                />
                <h3>Become a PAZ Saver!</h3>
              </div>
              <p>
                Start saving today and stand a chance to earn up to 12% per
                annum.
              </p>
              <button
                className={styles.mobileButton}
                onClick={() => router.push("/family-vault")}
              >
                Get started!
              </button>
            </div>
            {/* CardScrollIndicator for mobileSavingVault */}
          </div>
          <CardScrollIndicator
            totalCards={mobileVaultCards}
            containerRef={mobileSavingVaultRef}
          />
        </div>
        <div className={styles.mobileLoanReminder}>
          <div className={styles.mobileLoanReminderText}>
            <p>Upcoming Loan Repayment</p>
            <h3>
              ₦ 0.00 <span>Due by Feb 6th</span>
            </h3>
          </div>
          <button
            className={styles.loanButton}
            onClick={() => router.push("/loans")}
          >
            Repay Loan
          </button>
        </div>
        <div className={styles.mobileRecentActivities}>
          <h3>Recent activity</h3>
          <div className={styles.mobileActivity}>
            <Image
              src="/activityLogo.png"
              alt="Activity Logo"
              width={50}
              height={50}
            />
            <div className={styles.activityText}>
              <h5>PAZ family vault created</h5>
              <p>2:45pm</p>
            </div>
          </div>
          <div className={styles.mobileActivity}>
            <Image
              src="/activityLogo.png"
              alt="Activity Logo"
              width={50}
              height={50}
            />
            <div className={styles.activityText}>
              <h5>
                <span>₦ 0.00</span> withdrawn from savings
              </h5>
              <p>2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {isSModalOpen && (
        <SetupModal
          isOpen={isSModalOpen}
          onClose={() => {
            setIsSModalOpen(false);
          }}
          handleBVNMopen={handleBVNMOpen}
          handleACMopen={handleACMOpen}
        />
      )}
      {isACModalOpen && (
        <AccountModal
          isOpen={isACModalOpen}
          onClose={() => setIsACModalOpen(false)}
        />
      )}

      {isASSModalOpen && (
        <AccountSetupSuccessModal
          isOpen={isASSModalOpen}
          onClose={() => setIsASSModalOpen(false)}
        />
      )}

      {isBVNModalOpen && (
        <BVNModal
          isOpen={isBVNModalOpen}
          onClose={() => {
            setIsBVNModalOpen(false);
          }}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default Dashboard;
