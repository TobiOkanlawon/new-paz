import React, { useMemo, useState } from "react";
import styles from "./ActiveLoansTable.module.css";
import {
  LuFilter,
  LuCalendar,
  LuChevronDown,
  LuEllipsisVertical,
} from "react-icons/lu";
import { PiReceiptLight } from "react-icons/pi";
import { MdChevronRight } from "react-icons/md";
import LoanDetailsModal from '@/app/(private)/dashboard/loans/components/modals/loanDetailsModal/LoanDetailsModal';
import RepayLoanModal from "@/app/(private)/dashboard/loans/components//modals/RepayLoanModal/RepayLoanModal";
import LoanRepaidCard from "../modals/LoanRepaidCardModal/LoanRepaidCard";

export type ActiveLoanRow = {
  id: number;
  loanType: string;
  interestAmount: string;
  loanAmount: string;
  loanBalance: string;
  date: string;
  status?: string;
  onActionClick?: VoidFunction;
};

type Props = {
  title?: string;
  rows?: ActiveLoanRow[];
  statusFilter?: string;
  dateRange?: string;
  onStatusFilterChange?: (status: string) => void;
  onFilterClick?: VoidFunction;
  onDateRangeClick?: VoidFunction;
  pageSize?: number;
  totalEntries?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

const ActiveLoansTable = ({
  title = "Active Loans",
  rows = [],
  statusFilter = "Transaction status",
  dateRange = "Wed, 3 Sept, 2024 - Sat, 5 Sept, 2024",
  onStatusFilterChange,
  onFilterClick,
  onDateRangeClick,
  pageSize = 8,
  totalEntries = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
}: Props) => {
  const [localPageSize, setLocalPageSize] = useState(pageSize);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [openActionRowId, setOpenActionRowId] = useState<number | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [showRepaidModal, setShowRepaidModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<ActiveLoanRow | null>(null);
  const [repayAmount, setRepayAmount] = useState<string>("");

  // Filter rows based on status and date range
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Status filter
      if (selectedStatus && selectedStatus !== "all") {
        const rowStatus = row.status?.toLowerCase() || "";
        const filterStatus = selectedStatus.toLowerCase();
        if (!rowStatus.includes(filterStatus)) return false;
      }

      // Date range filter
      if (startDate || endDate) {
        const rowDate = new Date(row.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && rowDate < start) return false;
        if (end) {
          const endDateTime = new Date(end);
          endDateTime.setHours(23, 59, 59, 999);
          if (rowDate > endDateTime) return false;
        }
      }

      return true;
    });
  }, [rows, selectedStatus, startDate, endDate]);

  const filteredTotal = filteredRows.length;
  const calculatedTotalPages = Math.max(1, Math.ceil(filteredTotal / localPageSize));

  // Paginate filtered rows
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * localPageSize;
    return filteredRows.slice(start, start + localPageSize);
  }, [filteredRows, currentPage, localPageSize]);

  const handleStatusFilterClick = (status: string) => {
    setSelectedStatus(status);
    onStatusFilterChange?.(status);
    setShowStatusDropdown(false);
    onPageChange?.(1); // Reset to page 1
  };

  const getFilterDisplayText = () => {
    if (selectedStatus && selectedStatus !== "all") return selectedStatus;
    return statusFilter;
  };

  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${startDate} - ${endDate}`;
    }
    return dateRange;
  };

  const handleClearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setShowDatePicker(false);
  };

  const handleViewDetails = (loan: ActiveLoanRow) => {
    setSelectedLoan(loan);
    setShowDetailsModal(true);
    setOpenActionRowId(null);
  };

  const handleRepayLoan = (loan: ActiveLoanRow) => {
    setSelectedLoan(loan);
    setShowRepayModal(true);
    setOpenActionRowId(null);
  };

  const handleRepaySubmit = (amount: string) => {
    console.log(`Repaying ₦${amount} for loan ${selectedLoan?.loanType}`);
    setRepayAmount(amount);
    setShowRepayModal(false);
    setShowRepaidModal(true);
    // Add your repay logic here
  };

  const handlePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setLocalPageSize(val);
    onPageSizeChange?.(val);
  };

  const renderPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (calculatedTotalPages <= 5) {
      for (let i = 1; i <= calculatedTotalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage < calculatedTotalPages - 2) pages.push("...");
      pages.push(calculatedTotalPages);
    }

    return pages.map((p, i) =>
      p === "..." ? (
        <span key={`ellipsis-${i}`} className={styles.ellipsis}>...</span>
      ) : (
        <button
          key={p}
          className={`${styles.pageBtn} ${currentPage === p ? styles.activePage : ""}`}
          onClick={() => onPageChange?.(p as number)}
        >
          {p}
        </button>
      )
    );
  };

  return (
    <div className={styles.wrapper}>
      {/* Title */}
      <div className={styles.titleBar}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div style={{ position: "relative" }}>
          <button 
            className={styles.statusFilter}
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            {getFilterDisplayText()}
            <LuChevronDown size={16} />
          </button>
          {showStatusDropdown && (
            <div className={styles.statusDropdown}>
              <button 
                className={styles.dropdownItem}
                onClick={() => handleStatusFilterClick("all")}
              >
                All Loans
              </button>
              <button 
                className={styles.dropdownItem}
                onClick={() => handleStatusFilterClick("active")}
              >
                Active
              </button>
              <button 
                className={styles.dropdownItem}
                onClick={() => handleStatusFilterClick("completed")}
              >
                Completed
              </button>
              <button 
                className={styles.dropdownItem}
                onClick={() => handleStatusFilterClick("pending")}
              >
                Pending
              </button>
            </div>
          )}
        </div>
        <div className={styles.toolbarRight}>
          <button className={styles.filterBtn} onClick={onFilterClick}>
            Filters <LuFilter size={16} />
          </button>
          <div style={{ position: "relative" }}>
            <button 
              className={styles.dateBtn}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <LuCalendar size={16} />
              {getDateRangeText()}
              <LuChevronDown size={16} />
            </button>
            {showDatePicker && (
              <div className={styles.datePickerDropdown}>
                <div className={styles.dateInputGroup}>
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
                <div className={styles.dateInputGroup}>
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
                <div className={styles.datePickerActions}>
                  <button 
                    className={styles.clearBtn}
                    onClick={handleClearDateFilter}
                  >
                    Clear
                  </button>
                  <button 
                    className={styles.applyBtn}
                    onClick={() => setShowDatePicker(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table or Empty State */}
      {filteredRows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <PiReceiptLight size={36} color="#b1b1b1" />
          </div>
          <p className={styles.emptyText}>No record found</p>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Loan Type</th>
                  <th>Interest Amount %</th>
                  <th>Loan Amount</th>
                  <th>Loan Balance</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row, idx) => {
                  const sn = (currentPage - 1) * localPageSize + (idx + 1);
                  return (
                    <tr key={row.id}>
                      <td className={styles.indexCell}>{sn}</td>
                      <td className={styles.loanTypeCell}>{row.loanType}</td>
                      <td>{row.interestAmount}</td>
                      <td>{row.loanAmount}</td>
                      <td className={styles.balanceCell}>{row.loanBalance}</td>
                      <td>{row.date}</td>
                      <td>
                        <div style={{ position: "relative" }}>
                          <button
                            className={styles.actionBtn}
                            onClick={() => setOpenActionRowId(openActionRowId === row.id ? null : row.id)}
                          >
                            <LuEllipsisVertical size={18} color="#878787" />
                          </button>
                          {openActionRowId === row.id && (
                            <div className={styles.actionDropdown}>
                              <button
                                className={styles.actionDropdownItem}
                                onClick={() => handleViewDetails(row)}
                              >
                                View Details
                              </button>
                              <button
                                className={styles.actionDropdownItem}
                                onClick={() => handleRepayLoan(row)}
                              >
                                Repay Loan
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <span className={styles.entriesText}>
              Showing {filteredRows.length === 0 ? 0 : (currentPage - 1) * localPageSize + 1} to {Math.min(currentPage * localPageSize, filteredTotal)} of {filteredTotal} entries
            </span>
            <div className={styles.footerRight}>
              <div className={styles.pageSizeWrapper}>
                <span>Show</span>
                <select
                  className={styles.pageSizeSelect}
                  value={localPageSize}
                  onChange={handlePageSize}
                >
                  {[8, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className={styles.pagination}>
                {renderPageNumbers()}
                <button
                  className={styles.nextBtn}
                  onClick={() => onPageChange?.(Math.min(currentPage + 1, calculatedTotalPages))}
                  disabled={currentPage === calculatedTotalPages}
                >
                  <MdChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Loan Details Modal */}
      {selectedLoan && (
        <LoanDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          details={[
            { label: "Loan Type", value: selectedLoan.loanType },
            { label: "Loan Amount", value: selectedLoan.loanAmount },
            { label: "Interest Amount", value: selectedLoan.interestAmount },
            { label: "Loan Balance", value: selectedLoan.loanBalance },
            { label: "Date", value: selectedLoan.date },
          ]}
        />
      )}

      {/* Repay Loan Modal */}
      {selectedLoan && (
        <RepayLoanModal
          isOpen={showRepayModal}
          onClose={() => setShowRepayModal(false)}
          onRepay={handleRepaySubmit}
        />
      )}

      {/* Loan Repaid Modal */}
      {selectedLoan && (
        <LoanRepaidCard
          isOpen={showRepaidModal}
          onClose={() => setShowRepaidModal(false)}
          userName="User"
          summaryDetails={[
            { label: "Amount Repaid", value: `₦${repayAmount}` },
            { label: "Status", value: "Completed" },
          ]}
          benefits={[
            { label: "Loan Limit", oldValue: "₦500,000", newValue: "₦750,000" },
            { label: "Interest Rate", oldValue: "12%", newValue: "10%" },
          ]}
          onBack={() => setShowRepaidModal(false)}
          onApply={() => setShowRepaidModal(false)}
        />
      )}
    </div>
  );
};

export default ActiveLoansTable;