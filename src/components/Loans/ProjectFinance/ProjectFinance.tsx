'use client'

import React, { useState } from 'react'
import LoanHeader from '@/components/Loans/loanHeader'
import styles from './projectFinance.module.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import Image from 'next/image';
import LoanTable from '../LoanTable/LoanTable';
import LoanDetailsModal from '../modals/loanDetailsModal/LoanDetailsModal';
import ApplyProjectFinanceLoanModal from '../modals/ApplyProjectFinanceLoanModal/ApplyProjectFinanceLoanModal';
import type { LoanRow } from '../LoanTable/LoanTable';
import LoanApplicationResult from '../shared/LoanApplicationResult';

const ProjectFinance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<LoanRow | null>(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);

    const handleViewDetails = (loan: LoanRow) => {
        setSelectedLoan(loan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLoan(null);
    };

    const handleOpenApplyModal = () => {
        setIsApplyModalOpen(true);
    };

    const handleCloseApplyModal = () => {
        setIsApplyModalOpen(false);
    };

    const handleApplicationSubmit = () => {
        setIsApplyModalOpen(false);
        setIsResultOpen(true);
    };

    const handleCloseResultModal = () => {
        setIsResultOpen(false);
    };

    const loanDetails = selectedLoan ? [
        { label: "Project Name", value: selectedLoan.projectName },
        { label: "Amount", value: selectedLoan.amount },
        { label: "Date Submitted", value: selectedLoan.dateSubmitted },
        { label: "Date Approved", value: selectedLoan.dateApproved },
        { label: "Status", value: selectedLoan.status },
    ] : [];
    return (
        <div className={styles.container}>
            <LoanHeader title='Project Finance' desc='We fund your projects and grow with you' buttonText='New Application' buttonAction={handleOpenApplyModal}/>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", paddingBottom: "44px" }}>

                <ProjectCard
                    icon={<Image src={'/icon/folderoutlined.svg'} alt='Total Projects' width={24} height={24} />}
                    iconBg="#E6F9ED"
                    title="Total Projects"
                    amount="0"
                />

                <ProjectCard
                    icon={<Image src={'/icon/fileManagement.svg'} alt='Active Projects' width={24} height={24} />}
                    iconBg="#ECEEFF"
                    title="Active Projects"
                    amount="0"
                />

                <ProjectCard
                    icon={<Image src={'/icon/fundedBag.svg'} alt='Total Projects' width={24} height={24} />}
                    iconBg="#FDF3E0"
                    title="Total Funded"
                    amount="0"
                    prefix="NGN"
                />

            </div>
            <LoanTable
                rows={[
                    {
                        id: 1,
                        projectName: "Agricultural processing plants",
                        amount: "5,000,000",
                        dateSubmitted: "Mon, 21 Dec 2025",
                        dateApproved: "Mon, 21 Dec 2025",
                        status: "Success",
                        onActionClick: () => handleViewDetails({
                            id: 1,
                            projectName: "Agricultural processing plants",
                            amount: "5,000,000",
                            dateSubmitted: "Mon, 21 Dec 2025",
                            dateApproved: "Mon, 21 Dec 2025",
                            status: "Success",
                        }),
                    },
                    {
                        id: 2,
                        projectName: "Agricultural processing plants",
                        amount: "5,000,000",
                        dateSubmitted: "Mon, 21 Dec 2025",
                        dateApproved: "Mon, 21 Dec 2025",
                        status: "Success",
                        onActionClick: () => handleViewDetails({
                            id: 2,
                            projectName: "Agricultural processing plants",
                            amount: "5,000,000",
                            dateSubmitted: "Mon, 21 Dec 2025",
                            dateApproved: "Mon, 21 Dec 2025",
                            status: "Success",
                        }),
                    },
                    {
                        id: 3,
                        projectName: "Agricultural processing plants",
                        amount: "5,000,000",
                        dateSubmitted: "Mon, 21 Dec 2025",
                        dateApproved: "Mon, 21 Dec 2025",
                        status: "Pending",
                        onActionClick: () => handleViewDetails({
                            id: 3,
                            projectName: "Agricultural processing plants",
                            amount: "5,000,000",
                            dateSubmitted: "Mon, 21 Dec 2025",
                            dateApproved: "Mon, 21 Dec 2025",
                            status: "Pending",
                        }),
                    },
                    {
                        id: 4,
                        projectName: "Agricultural processing plants",
                        amount: "5,000,000",
                        dateSubmitted: "Mon, 21 Dec 2025",
                        dateApproved: "Mon, 21 Dec 2025",
                        status: "Pending",
                        onActionClick: () => handleViewDetails({
                            id: 4,
                            projectName: "Agricultural processing plants",
                            amount: "5,000,000",
                            dateSubmitted: "Mon, 21 Dec 2025",
                            dateApproved: "Mon, 21 Dec 2025",
                            status: "Pending",
                        }),
                    },
                    {
                        id: 5,
                        projectName: "Agricultural processing plants",
                        amount: "5,000,000",
                        dateSubmitted: "Mon, 21 Dec 2025",
                        dateApproved: "Mon, 21 Dec 2025",
                        status: "Failed",
                        onActionClick: () => handleViewDetails({
                            id: 5,
                            projectName: "Agricultural processing plants",
                            amount: "5,000,000",
                            dateSubmitted: "Mon, 21 Dec 2025",
                            dateApproved: "Mon, 21 Dec 2025",
                            status: "Failed",
                        }),
                    },
                ]}
                totalEntries={5}
                totalPages={1}
                currentPage={1}
                onPageChange={(page) => console.log(page)}
            />
            <LoanDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                details={loanDetails}
            />
            <ApplyProjectFinanceLoanModal
                isOpen={isApplyModalOpen}
                onClose={handleCloseApplyModal}
                onSubmit={handleApplicationSubmit}
            />
            {isResultOpen && <LoanApplicationResult status='pending' onClose={handleCloseResultModal} onBack={handleCloseResultModal} isOpen={isResultOpen}/>}
        </div>
    )
}

export default ProjectFinance;