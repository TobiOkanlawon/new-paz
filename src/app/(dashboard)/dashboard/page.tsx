"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import Image from "next/image";
import CardScrollIndicator from "@/components/CardScrollIndicator";
// import {LuEye, LuEyeOff} from 'react-icons/lu'

const Dashboard = () => {
  const user = { first_name: "Biodun" };

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

  const router = useRouter();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.totals}>
          <div className={`${styles.totalCategories} ${styles.lightBlue}`}>
            <div className={styles.textIcon}>
              <p>Total Savings</p>
              <Image
                src="/dashboardSavings.png"
                width={40}
                height={40}
                alt="Savings"
              />
            </div>
            <h3>
              ₦ {showSavings ? "20,000" : "****"}{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setShowSavings((s) => !s)}
              >
                <Image
                  src={showSavings ? "/eyeOff.png" : "/eyeOff2.png"}
                  alt="eyes off"
                  width={12}
                  height={12}
                />
              </span>
            </h3>
          </div>
          <div className={`${styles.totalCategories} ${styles.darkBlue}`}>
            <div className={styles.textIcon}>
              <p>Total Savings</p>
              <Image
                src="/dashboardLoan.png"
                width={40}
                height={40}
                alt="Savings"
              />
            </div>
            <h3>
              ₦ {showLoans ? "20,000" : "****"}{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setShowLoans((s) => !s)}
              >
                <Image
                  src={showLoans ? "/eyeOff2.png" : "/eyeOff.png"}
                  alt="eyes off"
                  width={12}
                  height={12}
                />
              </span>
            </h3>
          </div>
          <div className={`${styles.totalCategories} ${styles.purple}`}>
            <div className={styles.textIcon}>
              <p>Total Savings</p>
              <Image
                src="/dashboardInvestment.png"
                width={40}
                height={40}
                alt="Savings"
              />
            </div>
            <h3>
              ₦ {showInvestments ? "20,000" : "****"}{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setShowInvestments((s) => !s)}
              >
                <Image
                  src={showInvestments ? "/eyeOff2.png" : "/eyeOff.png"}
                  alt="eyes off"
                  width={12}
                  height={12}
                />
              </span>
            </h3>
          </div>
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
        <h1>
          Welcome <strong>{user?.first_name}</strong>
        </h1>
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
                  ₦ 20,000{" "}
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
                  ₦ 20,000{" "}
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
                  ₦ 20,000{" "}
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
              ₦ 20,000 <span>Due by Feb 6th</span>
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
                <span>₦ 20,000</span> withdrawn from savings
              </h5>
              <p>2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
