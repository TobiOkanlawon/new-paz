'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './emptyDash.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import LoanHeader from '../loanHeader'
import { TransactionRow } from '@/components/TransactionTable/TransactionTable';
import LoanCard from '../loanCard/LoanCard'
import LoanTypeCard from '../availableLoanCard/AvailableLoanCard'
import LoansClient from '../LoansClient'
import ApplyForLoanModal from '../applyForLoanModal/ApplyForLoanModal';
import ApplyQuickLoanModal from '../modals/applyQuickLoanModal/ApplyQuickLoanModal'
import LoanApplicationResult from '../shared/LoanApplicationResult'
import ApplyPersonalLoanModal from '../modals/ApplyPersonalLoanModal/ApplyPersonalLoanModal'
import BusinessLoanModal from '../modals/BusinessLoanModal/BusinessLoanModal'
import LocalPurchaseOrderModal from '../modals/LocalPurchaseOrderModal/LocalPurchaseOrderModal'
import AssetFinanceLoanModal from '../modals/AssetFinanceLoanModal/AssetFinanceLoanModal'
import MakePaymentModal from '../modals/MakePaymentModal/MakePaymentModal'
import RepayLoanModal from '../modals/RepayLoanModal/RepayLoanModal'
import type { ActiveLoanData, LoanProduct } from '@/actions/loans'
import { findLoanProduct, formatTenureRange } from '../shared/loanTenure'

type Props = {
    autoOpenApply?: boolean;
    onAutoOpenApplyHandled?: VoidFunction;
    hasPendingLoanRequest?: boolean;
    activeLoan?: ActiveLoanData;
    loanProducts?: LoanProduct[];
};

const formatNgn = (amount: number) => `NGN ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatLabel = (raw: string) =>
    raw
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

const EmptyDash = ({ autoOpenApply = false, onAutoOpenApplyHandled, hasPendingLoanRequest = false, activeLoan, loanProducts = [] }: Props) => {
    const rows: TransactionRow[] = [];

    const quickLoanProduct = findLoanProduct(loanProducts, 'QUICK_LOAN');
    const personalLoanProduct = findLoanProduct(loanProducts, 'PERSONAL_LOAN');
    const lpoProduct = findLoanProduct(loanProducts, 'LOCAL_PURCHASE_ORDER');
    const assetFinanceProduct = findLoanProduct(loanProducts, 'ASSET_FINANCE');
    const businessMaxTenor = Math.max(lpoProduct?.tenor ?? 0, assetFinanceProduct?.tenor ?? 0) || undefined;

    // Application Result state
    const [applicationStatus, setApplicationStatus] = useState<'success' | 'pending' | 'unsuccessful'>('pending')
    const [isApplicationOpen, setIsApplicationOpen] = useState(false)
    const handleApplicationModalClose = () => {
        setIsApplicationOpen(false)
    }
    const handleApplicationModalOpen = (status: 'success' | 'pending' | 'unsuccessful') => {
        setApplicationStatus(status)
        setIsApplicationOpen(true)
    }


    // Quick loan modal state
    const [isQuickLoanModalOpen, setIsQuickLoanModalOpen] = useState(false)
    const handleQuickModalOpen = () => {
        setIsApplyForLoanModalOpen(false);
        setIsQuickLoanModalOpen(true);
    }
    const handleQuickModalClose = () => {
        setIsQuickLoanModalOpen(false)
    }
    const handleQuickModalSubmit = () => {
        handleApplicationModalOpen('pending');
        handleQuickModalClose()
    }

    // Personal loan modal state
    const [isPersonalLoanModalOpen, setIsPersonalLoanModalOpen] = useState(false)
    const handlePersonalModalOpen = () => {
        setIsApplyForLoanModalOpen(false);
        setIsPersonalLoanModalOpen(true);
    }
    const handlePersonalModalClose = () => {
        setIsPersonalLoanModalOpen(false)
    }
    const handlePersonalModalSubmit = () => {
        handleApplicationModalOpen('pending');
        handlePersonalModalClose()
    }

    // Business loan modal state
    const [isBusinessLoanModalOpen, setIsBusinessLoanModalOpen] = useState(false)
    const handleBusinessModalOpen = () => {
        setIsApplyForLoanModalOpen(false);
        setIsBusinessLoanModalOpen(true);
    }
    const handleBusinessModalClose = () => {
        setIsBusinessLoanModalOpen(false)
    }

    // LPO loan modal state
    const [isLPOLoanModalOpen, setIsLPOLoanModalOpen] = useState(false)
    const handleLPOModalOpen = () => {
        setIsBusinessLoanModalOpen(false);
        setIsLPOLoanModalOpen(true);
    }
    const handleLPOModalClose = () => {
        setIsLPOLoanModalOpen(false)
    }
    const handleLPOModalSubmit = () => {
        handleApplicationModalOpen('pending')
        handleLPOModalClose()
    }

    // AFL loan modal state
    const [isAFLLoanModalOpen, setIsAFLLoanModalOpen] = useState(false)
    const handleAFLModalOpen = () => {
        setIsBusinessLoanModalOpen(false);
        setIsAFLLoanModalOpen(true);
    }
    const handleAFLModalClose = () => {
        setIsAFLLoanModalOpen(false)
    }
    const handleAFLModalSubmit = () => {
        handleApplicationModalOpen('pending')
        handleAFLModalClose()
    }

    // Payement loan modal state
    const [isPaymentLoanModalOpen, setIsPaymentLoanModalOpen] = useState(false)
    const handlePaymentModalOpen = () => {
        setIsPaymentLoanModalOpen(true);
    }
    const handlePaymentModalClose = () => {
        setIsPaymentLoanModalOpen(false)
    }

    // Repay loan modal state
    const [isRepayLoanModalOpen, setIsRepayLoanModalOpen] = useState(false)
    const handleRepayModalOpen = () => {
        setIsRepayLoanModalOpen(true);
    }
    const handleRepayModalClose = () => {
        setIsRepayLoanModalOpen(false)
    }
    const outstandingBalance = activeLoan
        ? activeLoan.TotalPayable - activeLoan.AmountLiquidated
        : 0

    // Apply loan modal state
    const [isApplyForLoanModalOpen, setIsApplyForLoanModalOpen] = useState(false)
    const handleApplyModalClose = () => {
        setIsApplyForLoanModalOpen(false)
    }
    const handleApplyModalOpen = () => {
        setIsApplyForLoanModalOpen(true)
    }

    // Auto-open the apply modal when arriving here straight after passing eligibility
    useEffect(() => {
        if (autoOpenApply) {
            setIsApplyForLoanModalOpen(true)
            onAutoOpenApplyHandled?.()
        }
    }, [autoOpenApply, onAutoOpenApplyHandled])
    const loanOptions = [
        {
            icon: (<Image src="/icon/walletAdd.svg" alt="Add money" width={15} height={14} />),
            iconBg: '#E9EDFA',
            title: 'Quick Loan',
            description: 'Apply for a quick loan and get it in minutes',
            onSelect: () => { handleQuickModalOpen() }
        },
        {
            icon: (<Image src="/icon/moneyHand.svg" alt="money Hand" width={15} height={14} />),
            iconBg: '#EBFFF2',
            title: 'Personal Loan',
            description: 'Apply for a personal loan and get it in minutes',
            onSelect: () => { handlePersonalModalOpen() }
        },
        {
            icon: (<Image src="/icon/briefcase.svg" alt="money bag" width={15} height={14} />),
            iconBg: '#FFF3DF',
            title: 'Business Loan',
            description: 'Apply for business loan for any purpose and get it.',
            onSelect: () => { handleBusinessModalOpen() }
        },
    ]

    const router = useRouter()
    const handleProjectFinanceRedirect = () => {
        router.push('/dashboard/loans/project-finance')
    }
    const businessOptions = [
        {
            icon: (<Image src="/icon/briefcase.svg" alt="money bag" width={15} height={14} />),
            iconBg: '#FFF3DF',
            title: 'Local Purchase Order',
            description: 'Apply for an LPO  loan for your business and get it.',
            onSelect: () => { handleLPOModalOpen() }
        },
        {
            icon: (<Image src="/icon/briefcase.svg" alt="money bag" width={15} height={14} />),
            iconBg: '#FFF3DF',
            title: 'Asset Finance',
            description: 'Apply for an Asset finance for your business and get it.',
            onSelect: () => { handleAFLModalOpen() }

        },
        {
            icon: (<Image src="/icon/briefcase.svg" alt="money bag" width={15} height={14} />),
            iconBg: '#FFF3DF',
            title: 'Project Finance',
            description: 'Apply for a Project Finance for your business and get it.',
            comingSoon: true,
            onSelect: () => { /* intentionally disabled - coming soon */ }
        },
    ]

    return (
        <div className={styles.container}>
            <LoanHeader
                title='Loans'
                desc='Manage your loans and explore financing options'
                buttonText='Apply for a loan'
                buttonAction={handleApplyModalOpen}
                secondaryButtonText={outstandingBalance > 0 ? 'Repay Loan' : undefined}
                secondaryButtonAction={handleRepayModalOpen}
            />
            <div className={styles.loanCardContainer}>
                <LoanCard
                    icon={<Image src="/icon/moneyBag.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#E6F9ED"
                    title="Total Borrowed"
                    amount={formatNgn(activeLoan?.AmountDisbursed ?? 0)}
                    bottomRight={activeLoan ? formatLabel(activeLoan.ProductName) : "No active loan"}
                    bottomRightColor="#17A842"
                />

                <LoanCard
                    icon={<Image src="/icon/moneyRemove.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#FDE8E8"
                    title="Outstanding Balance"
                    amount={formatNgn(
                        activeLoan
                            ? activeLoan.TotalPayable - activeLoan.AmountLiquidated
                            : 0,
                    )}
                    bottomRight={activeLoan ? `Tenor: ${activeLoan.Tenor}` : undefined}
                    bottomRightColor="#E05C5C"
                />

                <LoanCard
                    icon={<Image src="/icon/calendar.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#FDF3E0"
                    title="Monthly Payment"
                    amount={formatNgn(activeLoan?.MonthlyPayment ?? 0)}
                    bottomRight={activeLoan ? `Due: ${formatDate(activeLoan.MaturityDate)}` : undefined}
                    bottomRightColor="#17A842"
                />
            </div>
            <h3 className={styles.subtitle}>Available Loans</h3>
            <div className={styles.loanCardContainer}>
                <LoanTypeCard
                    icon={<Image src="/icon/moneyHand.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#E6F9ED"
                    duration={formatTenureRange(personalLoanProduct?.tenor, "Up to 30 days")}
                    title="Personal Loan"
                    description="Quick and flexible loans for your needs"
                    accentColor="#17A842"
                    onApply={handlePersonalModalOpen}
                />

                <LoanTypeCard
                    icon={<Image src="/icon/walletAdd.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#ECEEFF"
                    duration={formatTenureRange(quickLoanProduct?.tenor, "Up to 90 days")}
                    title="Quick Loan"
                    description="Quick and flexible loans for your needs"
                    accentColor="#5B6EE8"
                    onApply={handleQuickModalOpen}
                />

                <LoanTypeCard
                    icon={<Image src="/icon/briefcase.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#FDF3E0"
                    duration={formatTenureRange(businessMaxTenor, "Up to 365 days")}
                    title="Business Loan"
                    description="Quick and flexible loans for your needs"
                    accentColor="#E09A1A"
                    onApply={handleBusinessModalOpen}
                />
            </div>
            {/* Transactions table handled by a client wrapper to enable pagination and controls */}
            <LoansClient rows={rows} />

            <ApplyForLoanModal isOpen={isApplyForLoanModalOpen} onClose={handleApplyModalClose} options={loanOptions} />
            <ApplyQuickLoanModal isOpen={isQuickLoanModalOpen} onClose={handleQuickModalClose} onSubmit={handleQuickModalSubmit} loanProduct={quickLoanProduct} />
            <ApplyPersonalLoanModal isOpen={isPersonalLoanModalOpen} onClose={handlePersonalModalClose} onSubmit={handlePersonalModalSubmit} loanProduct={personalLoanProduct} />
            <BusinessLoanModal isOpen={isBusinessLoanModalOpen} onClose={handleBusinessModalClose} options={businessOptions} />
            <LocalPurchaseOrderModal isOpen={isLPOLoanModalOpen} onClose={handleLPOModalClose} onSubmit={handleLPOModalSubmit} loanProduct={lpoProduct} />
            <AssetFinanceLoanModal isOpen={isAFLLoanModalOpen} onClose={handleAFLModalClose} onMakePayment={handlePaymentModalOpen} onSubmit={handleAFLModalSubmit} loanProduct={assetFinanceProduct} />
            <MakePaymentModal isOpen={isPaymentLoanModalOpen} onClose={handlePaymentModalClose} onPay={() => { handlePaymentModalClose() }} />
            <RepayLoanModal isOpen={isRepayLoanModalOpen} onClose={handleRepayModalClose} outstandingBalance={outstandingBalance} />
            <LoanApplicationResult status={applicationStatus} isOpen={isApplicationOpen} onClose={handleApplicationModalClose} onBack={handleApplicationModalClose} />
        </div>
    )
}

export default EmptyDash