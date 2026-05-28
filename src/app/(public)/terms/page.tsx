'use client'

import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './Termsandconditions.module.css'

const TermsHeader = () => {
  const router = useRouter()

  return (
    <nav className={styles.navContainer}>
      <Image src={'/images/pazColorLogo.svg'} alt='Paz Logo' width={100} height={34.13} />
      <button className={styles.backButton} onClick={() => router.back()} aria-label='Go back'>
        <Image src={'/icon/cancel.svg'} alt='cancel' width={18} height={18} />
      </button>
    </nav>
  )
}

const TermsHero = () => {
  return (
    <section className={styles.HeroContainer}>
      <Image className={styles.HeroImage1} src={'/images/tcBackground.png'} alt='Terms and condition hero section background' width={1443} height={470.5} />
      <Image className={styles.HeroImage2} src={'/images/tcBgCut.png'} alt='Terms and condition hero section background' width={1440} height={180} />
      <Image className={styles.HeroImage3} src={'/images/tcImageBg.svg'} alt='Terms and condition hero section background' width={426} height={470} />

      <div className={styles.textContainer}>
        <h2 className={styles.HeroHeader}>Terms and Conditions of Use</h2>
        <p className={styles.HeroText}>We value your privacy</p>
      </div>
    </section>
  )
}

const Terms = () => {
  return (
    <article className={styles.termsArticle}>
      <h1 className={styles.termsMainHeader}>Terms and Conditions</h1>
      <h4 className={styles.termsSubHeader}>Last updated: March 2025</h4>

      <p className={styles.termsText}>
        Welcome to PAZ Finance limited (&ldquo;Paz&rdquo;). This terms govern your use of our web application and loan services. By creating an account or applying for a loan, you agree to be legally bound by these terms.
      </p>

      <h3 className={styles.termsSectionHeader}>1. Eligibility</h3>
      <p className={styles.termsText}>By using this app, you confirm that:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>You are at least 18 years old</li>
        <li className={styles.termsText}>You have the legal capacity to enter into a binding agreement</li>
        <li className={styles.termsText}>All information provided is accurate and complete</li>
      </ul>
      <p className={styles.termsText}>
        Providing false information may result in <span className={styles.termsBold}>account suspension, loan recall, and legal action.</span>
      </p>

      <h3 className={styles.termsSectionHeader}>2. Account Creation and Verification [KYC]</h3>
      <p className={styles.termsText}>You authorize Paz to:</p>
      <p className={styles.termsText}>Verify your identity using your BVN, NIN, phone number, or other identifiers</p>
      <p className={styles.termsText}>Access and validate your financial and personal data through licensed third parties</p>
      <p className={styles.termsText}>Paz reserves the right to approve, decline, or suspend any account at its discretion.</p>

      <h3 className={styles.termsSectionHeader}>3. Loan Application and Approval</h3>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Loan offers are made at Paz&rsquo;s sole discretion</li>
        <li className={styles.termsText}>Approved loan amounts, interest, fees, and repayment schedules will be clearly displayed before acceptance</li>
        <li className={styles.termsText}>By clicking &ldquo;Accept&rdquo;, you enter into a legally binding loan agreement.</li>
      </ul>

      <h3 className={styles.termsSectionHeader}>4. Interest, Fees and Charges</h3>
      <p className={styles.termsText}>You agree to pay:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Interest as stated in your loan offer</li>
        <li className={styles.termsText}>Administrative and management fees</li>
        <li className={styles.termsText}>Applicable taxes (including VAT)</li>
      </ul>
      <p className={styles.termsText}>All charges will be disclosed before you accept the loan</p>

      <h3 className={styles.termsSectionHeader}>5. Repayment Obligations</h3>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Repay your loan on or before the due date</li>
        <li className={styles.termsText}>Ensure sufficient funds are available for repayment</li>
        <li className={styles.termsText}>Failure to repay on time will result in penalties and recovery actions.</li>
      </ul>

      <h3 className={styles.termsSectionHeader}>6. Direct Debit Authorisation (MANDATORY)</h3>
      <p className={styles.termsText}>
        By accepting a claim, you <span className={styles.termsBold}>irrevocably authorise</span> Paz to:
      </p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Debit your bank account(s) for the amount owed</li>
        <li className={styles.termsText}>Use direct deductions or direct debit mandates</li>
        <li className={styles.termsText}>Recover funds from any account linked to your BVN or Identity</li>
        <li className={styles.termsText}>This authorisation remains valid until your loan is fully repaid</li>
      </ul>

      <h3 className={styles.termsSectionHeader}>7. Garnishee and Recovery Content</h3>
      <p className={styles.termsText}>You agree that Paz may:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Initiate garnishee proceedings against your bank accounts</li>
        <li className={styles.termsText}>Obtain court orders to recover outstanding amounts</li>
        <li className={styles.termsText}>Share your information with financial institutions for recovery</li>
        <li className={styles.termsText}>You waive the need for further consent for such actions.</li>
      </ul>

      <h3 className={styles.termsSectionHeader}>8. Credit Bureau Reporting</h3>
      <p className={styles.termsText}>You consent that:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Your loan and repayment history will be reported to licensed Credit Bureaus in Nigeria</li>
        <li className={styles.termsText}>Defaults may affect your credit profile and access to future loans</li>
      </ul>

      <h3 className={styles.termsSectionHeader}>9. Data Usage and Privacy</h3>
      <p className={styles.termsText}>By using this app, you consent to Paz:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Collecting and processing your personal and financial data</li>
        <li className={styles.termsText}>Accessing device data (where permitted), including contact lists, for credit assessment and recovery</li>
        <li className={styles.termsText}>Sharing your data with regulators, partners, and recovery agents</li>
      </ul>
      <p className={styles.termsText}>All data is handled in line with applicable laws.</p>

      <h3 className={styles.termsSectionHeader}>10. Default and Penalties</h3>
      <p className={styles.termsText}>If you fail to repay:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Penalty interest will apply as stated in your loan terms</li>
        <li className={styles.termsText}>Paz may immediately demand full repayment (loan acceleration)</li>
        <li className={styles.termsText}>Recovery actions will begin without further notice</li>
      </ul>

      <h3 className={styles.termsSectionHeader}>11. Recovery Actions</h3>
      <p className={styles.termsText}>In the event of default, Paz may:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Contact you via phone, SMS, email, or other means</li>
        <li className={styles.termsText}>Contact your employer, employer, or references</li>
        <li className={styles.termsText}>Engage third-party recovery agents</li>
        <li className={styles.termsText}>Take legal action to recover funds</li>
      </ul>

      <h3 className={styles.termsSectionHeader}>12. Guarantor (Where Applicable)</h3>
      <p className={styles.termsText}>If a guarantor is provided:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>They are legally responsible for repayment if you default</li>
        <li className={styles.termsText}>Paz may pursue them directly without prior notice to you with the same process applicable to you.</li>
      </ul>

      <h3 className={styles.termsSectionHeader}>13. Acceptable Use</h3>
      <p className={styles.termsText}>You agree not to:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Use the app for fraudulent or illegal activities</li>
        <li className={styles.termsText}>Harass or threaten Paz staff or representatives</li>
      </ul>
      <p className={styles.termsText}>
        Violation may result in <span className={styles.termsBold}>account termination and legal action</span>
      </p>

      <h3 className={styles.termsSectionHeader}>14. Limitation of Liability</h3>
      <p className={styles.termsText}>Paz shall not be liable for:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>Indirect or consequential losses</li>
        <li className={styles.termsText}>Service interruptions beyond its control</li>
      </ul>
      <p className={styles.termsText}>Our total liability is limited to the value of the service provided.</p>

      <h3 className={styles.termsSectionHeader}>15. Suspension or Termination</h3>
      <p className={styles.termsText}>Paz may suspend or terminate your account:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>If you breach these terms</li>
        <li className={styles.termsText}>For legal, regulatory, or operational reasons</li>
      </ul>

      <h3 className={styles.termsSectionHeader}>16. Changes To Terms</h3>
      <p className={styles.termsText}>
        Paz may update these Terms at any time. Continued use of the app means you accept the new terms.
      </p>

      <h3 className={styles.termsSectionHeader}>17. Governing Law</h3>
      <p className={styles.termsText}>
        You are governed by the <span className={styles.termsBold}>laws of the Federal Republic of Nigeria.</span>
      </p>
      <p className={styles.termsText}>
        Disputes shall be resolved in <span className={styles.termsBold}>courts within Lagos State</span> or through arbitration where applicable.
      </p>

      <h3 className={styles.termsSectionHeader}>18. Consent &amp; Acceptance</h3>
      <p className={styles.termsText}>By clicking <span className={styles.termsBold}>&ldquo;I Agree&rdquo;</span>, you confirm that:</p>
      <ul className={styles.termsList}>
        <li className={styles.termsText}>You have read and understood Paz&rsquo;s Terms</li>
        <li className={styles.termsText}>You agree to be legally bound</li>
        <li className={styles.termsText}>You acknowledge all rights stated above</li>
      </ul>
    </article>
  )
}

const TermsAndCondititons = () => {
  return (
    <div>
      <TermsHeader />
      <TermsHero />
      <Terms />
    </div>
  )
}

export default TermsAndCondititons
