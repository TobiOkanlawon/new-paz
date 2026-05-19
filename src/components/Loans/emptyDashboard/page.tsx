'use client'
import React, {useState} from 'react'
import styles from './emptyDash.module.css'
import Image from 'next/image'
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

const EmptyDash = () => {
    const rows: TransactionRow[] = [];

    // Application Result state
    const [isApplicationSuccessful, setIsApplicationSuccessful] = useState('pending')
    const [isApplicationOpen, setIsApplicationOpen] = useState(false)
    const handleApplicationModalClose = () => {
        setIsApplicationOpen(false)
    }
    const handleApplicationModalOpen = () => {
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
        handleApplicationModalOpen();
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
        handleApplicationModalOpen();
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
        handleApplicationModalOpen()
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
        handleApplicationModalOpen()
        handleAFLModalClose()
    }


    // Apply loan modal state
    const [isApplyForLoanModalOpen, setIsApplyForLoanModalOpen] = useState(false)
    const handleApplyModalClose = () => {
        setIsApplyForLoanModalOpen(false)
    }
    const handleApplyModalOpen = () => {
        setIsApplyForLoanModalOpen(true)
    }
    const loanOptions = [
        {
            icon: (<Image src="/icon/walletAdd.svg" alt="Add money" width={15} height={14} />),
            iconBg: '#E9EDFA',
            title: 'Quick Loan',
            description: 'Apply for a quick loan and get it in minutes',
            onSelect: () => {handleQuickModalOpen()}
        },
        {
            icon: (<Image src="/icon/moneyHand.svg" alt="money Hand" width={15} height={14} />),
            iconBg: '#EBFFF2',
            title: 'Personal Loan',
            description: 'Apply for a personal loan and get it in minutes',
            onSelect: () => {handlePersonalModalOpen()}
        },
        {
            icon: (<Image src="/icon/briefcase.svg" alt="money bag" width={15} height={14} />),
            iconBg: '#FFF3DF',
            title: 'Business Loan',
            description: 'Apply for business loan for any purpose and get it.',
            onSelect: () => {handleBusinessModalOpen()}
        },
    ]
    
    const businessOptions = [
        {
            icon: (<Image src="/icon/briefcase.svg" alt="money bag" width={15} height={14} />),
            iconBg: '#FFF3DF',
            title: 'Local Purchase Order',
            description: 'Apply for an LPO  loan for your business and get it.',
            onSelect: () => {handleLPOModalOpen()}
        },
        {
            icon: (<Image src="/icon/briefcase.svg" alt="money bag" width={15} height={14} />),
            iconBg: '#FFF3DF',
            title: 'Asset Finance',
            description: 'Apply for an Asset finance for your business and get it.',
            onSelect: () => {handleBusinessModalOpen()}
        },
        {
            icon: (<Image src="/icon/briefcase.svg" alt="money bag" width={15} height={14} />),
            iconBg: '#FFF3DF',
            title: 'Project Finance',
            description: 'Apply for a Project Finance for your business and get it.',
            onSelect: () => {handleBusinessModalOpen()}
        },
    ]

    return (
        <div className={styles.container}>
            <LoanHeader title='Loans' desc='Manage your loans and explore financing options' buttonText='Apply for a loan' buttonAction={handleApplyModalOpen} />
            <div className={styles.loanCardContainer}>
                <LoanCard
                    icon={<Image src="/icon/moneyBag.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#E6F9ED"
                    title="Total Borrowed"
                    amount="NGN 0.00"
                    bottomRight="Across two active loans"
                    bottomRightColor="#17A842"
                />

                <LoanCard
                    icon={<Image src="/icon/moneyRemove.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#FDE8E8"
                    title="Outstanding Balance"
                    amount="NGN 0.00"
                    bottomRight="55.5"
                    bottomRightColor="#E05C5C"
                />

                <LoanCard
                    icon={<Image src="/icon/calendar.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#FDF3E0"
                    title="Monthly Payment"
                    amount="NGN 0.00"
                    bottomRight="Next due: Mar 1, 2026"
                    bottomRightColor="#17A842"
                />
            </div>
            <h3 className={styles.subtitle}>Available Loans</h3>
            <div className={styles.loanCardContainer}>
                <LoanTypeCard
                    icon={<Image src="/icon/moneyHand.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#E6F9ED"
                    duration="Up to 30 days"
                    title="Personal Loan"
                    description="Quick and flexible loans for your needs"
                    accentColor="#17A842"
                />

                <LoanTypeCard
                    icon={<Image src="/icon/walletAdd.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#ECEEFF"
                    duration="Up to 3 months"
                    title="Quick Loan"
                    description="Quick and flexible loans for your needs"
                    accentColor="#5B6EE8"
                    onApply={handleQuickModalOpen}
                />

                <LoanTypeCard
                    icon={<Image src="/icon/briefcase.svg" alt="money bag" width={24} height={24} />}
                    iconBg="#FDF3E0"
                    duration="Up to 12 months"
                    title="Business Loan"
                    description="Quick and flexible loans for your needs"
                    accentColor="#E09A1A"
                />
            </div>
            {/* Transactions table handled by a client wrapper to enable pagination and controls */}
            <LoansClient rows={rows} />

            <ApplyForLoanModal isOpen={isApplyForLoanModalOpen} onClose={handleApplyModalClose} options={loanOptions}/>
            <ApplyQuickLoanModal isOpen={isQuickLoanModalOpen} onClose={handleQuickModalClose} onSubmit={handleQuickModalSubmit} />
            <ApplyPersonalLoanModal isOpen={isPersonalLoanModalOpen} onClose={handlePersonalModalClose} onSubmit={handlePersonalModalSubmit} />
            <BusinessLoanModal isOpen={isBusinessLoanModalOpen} onClose={handleBusinessModalClose} options={businessOptions} />
            <LocalPurchaseOrderModal isOpen={isLPOLoanModalOpen} onClose={handleLPOModalClose} onSubmit={handleLPOModalSubmit}/>
            <LoanApplicationResult status='pending' isOpen={isApplicationOpen} onClose={handleApplicationModalClose} onBack={handleApplicationModalClose} />
        </div>
    )
}

export default EmptyDash