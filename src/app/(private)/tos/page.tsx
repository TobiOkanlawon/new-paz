import styles from "./terms.module.css";
import Image from "next/image";
import TosBackButton from "./TosBackButton";

type SectionProps = {
    title: string;
    children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
    return (
        <section className={styles.section}>
            <h2>{title}</h2>
            {children}
        </section>
    );
}

export default function TermsPage() {
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <Image
                    src={'/tos/tosHero1.png'}
                    alt="Hero Image"
                    width={527}
                    height={422}
                    className={styles.heroImage}
                />
                <Image
                    src={'/tos/tosHero2.png'}
                    alt="Hero Image"
                    width={1440}
                    height={180}
                    className={styles.heroImage2}
                />
                <div className={styles.heroCopy}>
                    <h2>Terms and Conditions of Use</h2>
                    <p>We value your privacy</p>
                </div>
                <div className={styles.heroInner}>
                    <div className={styles.topBar}>
                        <div className={styles.logo}>
                            <Image
                                src={'/PAZLogo2.png'}
                                alt="Paz logo"
                                width={100}
                                height={35}
                            />
                        </div>

                        <TosBackButton />
                    </div>

                    <div className={styles.artwork} aria-hidden="true">
                    </div>
                </div>
            </section>

            <article className={styles.content}>
                <header className={styles.heading}>
                    <h1>Terms and Conditions</h1>
                    <p>
                        Last updated <span>March 2025</span>
                    </p>
                </header>

                <div className={styles.intro}>
                    <p>
                        Welcome to our platform. This Terms and Conditions agreement
                        outlines the rules, responsibilities and conditions governing your
                        use of our services.
                    </p>

                    <p>
                        By creating an account, accessing, browsing or otherwise using this
                        platform, you agree to be legally bound by these Terms.
                    </p>
                </div>

                <Section title="1. Eligibility">
                    <p>By using our services, you confirm that:</p>

                    <ul>
                        <li>You are legally permitted to enter into a binding agreement.</li>
                        <li>You have provided accurate and complete information.</li>
                        <li>
                            You meet all applicable legal and regulatory requirements
                            necessary to use the platform.
                        </li>
                    </ul>

                    <p>
                        If you do not meet these requirements, you should not access or use
                        the services.
                    </p>
                </Section>

                <Section title="2. Account Creation and Responsibility">
                    <p>To use certain features of the platform:</p>

                    <ul>
                        <li>You may be required to create an account.</li>
                        <li>
                            You are responsible for maintaining the confidentiality of your
                            login credentials.
                        </li>
                        <li>
                            You agree to provide information that is accurate, complete and
                            up to date.
                        </li>
                    </ul>

                    <p>
                        We reserve the right to suspend, restrict or terminate an account
                        where necessary.
                    </p>
                </Section>

                <Section title="3. Loan Application and Approval">
                    <ul>
                        <li>Submitting an application does not guarantee approval.</li>
                        <li>
                            Terms, interest rates, fees and repayment conditions may vary.
                        </li>
                        <li>
                            Applications may be subject to verification and additional review.
                        </li>
                    </ul>

                    <p>
                        Successful applications will be communicated through the platform.
                    </p>
                </Section>

                <Section title="4. Repayment Obligations">
                    <p>Where a facility is approved, you agree to:</p>

                    <ul>
                        <li>Repay all amounts due according to the agreed schedule.</li>
                        <li>Ensure sufficient funds are available when repayment is due.</li>
                        <li>
                            Authorize applicable charges, fees or penalties where applicable.
                        </li>
                    </ul>
                </Section>

                <Section title="5. Default and Consequences">
                    <p>In the event of default:</p>

                    <ul>
                        <li>We may take reasonable steps to recover outstanding amounts.</li>
                        <li>Additional charges may apply where legally permitted.</li>
                        <li>Your access to certain services may be restricted.</li>
                    </ul>
                </Section>

                {/* 6 */}
                <Section title="6. Direct Debit Authorization">
                    <ul>
                        <li>
                            You authorize us to debit your nominated account where applicable.
                        </li>
                        <li>
                            This authorization remains valid according to the terms accepted
                            by you.
                        </li>
                        <li>
                            You are responsible for ensuring sufficient funds are available.
                        </li>
                    </ul>
                </Section>

                {/* 7 */}
                <Section title="7. Credit Checks and Identity Confirmation">
                    <p>Where required, we may:</p>

                    <ul>
                        <li>Verify information supplied during registration.</li>
                        <li>Conduct lawful identity or credit-related checks.</li>
                        <li>
                            Use relevant third-party service providers to complete such
                            verification.
                        </li>
                    </ul>
                </Section>

                {/* 8 */}
                <Section title="8. Data Usage and Privacy">
                    <p>By using the platform, you consent to the collection and use of:</p>

                    <ul>
                        <li>Information required to provide our services.</li>
                        <li>
                            Information necessary for identity verification, risk assessment
                            and account management.
                        </li>
                        <li>
                            Other information processed in accordance with our Privacy Policy.
                        </li>
                    </ul>
                </Section>

                {/* 9 */}
                <Section title="9. Collection and Recovery">
                    <p>In the event of non-payment, we may:</p>

                    <ul>
                        <li>Contact you using the details you provided.</li>
                        <li>
                            Engage authorized third parties where necessary for recovery.
                        </li>
                        <li>Take other lawful steps to recover outstanding obligations.</li>
                    </ul>
                </Section>

                {/* 10 */}
                <Section title="10. Fees, Charges and Penalties">
                    <p>Applicable fees may include:</p>

                    <ul>
                        <li>Interest or service charges associated with your facility.</li>
                        <li>Charges arising from delayed or missed payments.</li>
                        <li>Other fees disclosed before you complete a transaction.</li>
                    </ul>
                </Section>

                {/* 11 */}
                <Section title="11. Limitation of Liability">
                    <p>To the extent permitted by law:</p>

                    <ul>
                        <li>We do not guarantee uninterrupted access to the platform.</li>
                        <li>
                            We are not responsible for losses arising from circumstances beyond
                            our reasonable control.
                        </li>
                    </ul>
                </Section>

                {/* 12 */}
                <Section title="12. Third-Party Services">
                    <p>The platform may contain or interact with third-party services.</p>

                    <ul>
                        <li>
                            We are not responsible for the content or operation of third-party
                            services.
                        </li>
                        <li>
                            Your use of third-party services may be governed by separate terms.
                        </li>
                    </ul>
                </Section>

                {/* 13 */}
                <Section title="13. Suspension and Termination">
                    <p>We may suspend or terminate access where:</p>

                    <ul>
                        <li>You breach these Terms or applicable law.</li>
                        <li>Fraudulent or suspicious activity is detected.</li>
                    </ul>

                    <p>
                        Suspension or termination does not affect obligations that arose
                        before termination.
                    </p>
                </Section>

                {/* 14 */}
                <Section title="14. Acceptable Use">
                    <p>You agree not to:</p>

                    <ul>
                        <li>Use the platform for illegal or unauthorized purposes.</li>
                        <li>Interfere with the security or operation of the service.</li>
                    </ul>
                </Section>

                {/* 15 */}
                <Section title="15. Changes to Terms">
                    <p>
                        We may update these Terms from time to time. Continued use of the
                        platform after an update means you accept the revised Terms.
                    </p>
                </Section>

                {/* 16 */}
                <Section title="16. Governing Law">
                    <p>
                        These Terms are governed by the applicable laws of the Federal
                        Republic of Nigeria.
                    </p>

                    <p>
                        Disputes shall be resolved in accordance with applicable law and
                        relevant jurisdiction.
                    </p>
                </Section>

                {/* 17 */}
                <Section title="17. Contact and Enquiries">
                    <p>For questions concerning these Terms:</p>

                    <ul>
                        <li>Contact our support team.</li>
                        <li>Use the contact channels provided on the platform.</li>
                    </ul>
                </Section>
            </article>
        </main>
    );
}