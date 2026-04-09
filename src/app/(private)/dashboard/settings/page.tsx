"use client";
import React, { useState } from "react";
import styles from "./setting.module.css";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import {
  LuLock,
  LuHeadphones,
  LuKey,
  LuShield,
  LuPhone,
  LuMail,
} from "react-icons/lu";
import SecurityQuestionsModal from "@/components/ResetPasswordModal/SecurityQuestionsModal";

type Tab = "account" | "support";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [securityQuestionSet, setSecurityQuestionSet] = useState(false);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Settings</h1>
        <p className={styles.heroSub}>
          Manage your account preferences and security
        </p>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Tab sidebar */}
        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "account" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("account")}
          >
            <span className={styles.tabIcon}>
              <LuLock size={20} />
            </span>
            Account Settings
          </button>
          <div className={styles.tabDivider} />
          <button
            className={`${styles.tab} ${activeTab === "support" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("support")}
          >
            <span className={styles.tabIcon}>
              <LuHeadphones size={20} />
            </span>
            Customer Support
          </button>
        </nav>

        {/* Content panel */}
        <div className={styles.panel}>
          {activeTab === "account" && (
            <>
              <p className={styles.sectionTitle}>Security & Authentication</p>
              <p className={styles.sectionDesc}>
                Keep your account safe with these settings
              </p>

              {/* Change Password */}
              <div className={styles.secCard}>
                <div className={styles.secCardLeft}>
                  <div className={styles.secCardIconWrap}>
                    <LuKey size={24} />
                  </div>
                  <div>
                    <p className={styles.secCardTitle}>Password</p>
                    <p className={styles.secCardDesc}>
                      Change your login password to keep your account secure.
                    </p>
                  </div>
                </div>
                <button
                  className={styles.secCardBtn}
                  onClick={() => setIsResetModalOpen(true)}
                >
                  Change Password
                </button>
              </div>

              {/* OTP */}
              {/* <div className={styles.otpCard}>
                <div className={styles.secCardLeft}>
                  <div className={styles.secCardIconWrap}><LuSmartphone size={24} /></div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <p className={styles.secCardTitle} style={{ margin: 0 }}>OTP Authentication</p>
                      <span className={`${styles.statusBadge} ${otpEnabled ? styles.badgeActive : styles.badgeOff}`}>
                        {otpEnabled ? '● On' : '○ Off'}
                      </span>
                    </div>
                    <p className={styles.secCardDesc}>
                      Receive a 6-digit code by SMS to verify it's you every time you log in.
                    </p>
                  </div>
                </div>
                <div className={styles.toggleWrap}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={otpEnabled}
                      onChange={() => setOtpEnabled(prev => !prev)}
                    />
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                  </label>
                  <span className={styles.toggleText}>{otpEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div> */}

              {/* Security Question */}
              <div className={styles.secCard}>
                <div className={styles.secCardLeft}>
                  <div className={styles.secCardIconWrap}>
                    <LuShield size={24} />
                  </div>
                  <div>
                    <p className={styles.secCardTitle}>Security Question</p>
                    <p className={styles.secCardDesc}>
                      Set a personal question to confirm your identity when
                      needed.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSecurityQuestionSet(true);
                  }}
                  className={styles.secCardBtn}
                >
                  Set Question
                </button>
              </div>
            </>
          )}

          {activeTab === "support" && (
            <>
              <p className={styles.sectionTitle}>Get in Touch</p>
              <p className={styles.sectionDesc}>
                We're here to help — reach out via any channel below
              </p>

              <div className={styles.supportGrid}>
                {/* Phone */}
                <div className={styles.supportCard}>
                  <div className={styles.supportCardTop}>
                    <div
                      className={`${styles.supportIconWrap} ${styles.supportIconBlue}`}
                    >
                      <LuPhone size={24} />
                    </div>
                    <div>
                      <p className={styles.supportCardLabel}>
                        Customer Care Line
                      </p>
                      <p className={styles.supportCardValue}>0904 422 3377</p>
                    </div>
                  </div>
                  <a href="tel:09044223377" className={styles.supportLink}>
                    Call Now →
                  </a>
                </div>

                {/* Email */}
                <div className={styles.supportCard}>
                  <div className={styles.supportCardTop}>
                    <div
                      className={`${styles.supportIconWrap} ${styles.supportIconGreen}`}
                    >
                      <LuMail size={24} />
                    </div>
                    <div>
                      <p className={styles.supportCardLabel}>Send Us a Mail</p>
                      <p className={styles.supportCardValue}>
                        inquiry@mypazfinance.com
                      </p>
                    </div>
                  </div>
                  <a
                    href="mailto:inquiry@mypazfinance.com"
                    className={styles.supportLink}
                  >
                    Send Email →
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
      <SecurityQuestionsModal
        isOpen={securityQuestionSet}
        onClose={() => setSecurityQuestionSet(false)}
      />
    </div>
  );
};

export default SettingsPage;
