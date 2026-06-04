import React, { useState } from "react";
import styles from "./LoanTable.module.css";
import { LuFilter, LuCalendar, LuChevronDown, LuEllipsisVertical } from "react-icons/lu";
import { MdChevronRight } from "react-icons/md";
import Image from "next/image";

export type LoanRow = {
  id: number;
  projectName: string;
  amount: string;
  dateSubmitted: string;
  dateApproved: string;
  status: "Success" | "Pending" | "Failed";
  onActionClick?: VoidFunction;
};

type Props = {
  rows?: LoanRow[];
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

const statusConfig = {
  Success: { color: "#17A842", bg: "#E6F9ED" },
  Pending: { color: "#E09A1A", bg: "#FDF3E0" },
  Failed: { color: "#E05C5C", bg: "#FDE8E8" },
};

const LoanTable = ({
  rows = [],
  statusFilter = "Projects status",
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
  const [selectedStatus, setSelectedStatus] = useState<"" | "Success" | "Pending" | "Failed">("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState<number | null>(null);

  // Parse date string to Date object for comparison
  const parseDate = (dateStr: string): Date | null => {
    try {
      // Handle "Mon, 21 Dec 2025" format
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  // Filter by status and date range
  const filteredRows = rows.filter(row => {
    // Status filter
    if (selectedStatus && row.status !== selectedStatus) return false;

    // Date range filter
    if (startDate || endDate) {
      const rowDate = parseDate(row.dateSubmitted);
      const start = startDate ? parseDate(startDate) : null;
      const end = endDate ? parseDate(endDate) : null;

      if (rowDate) {
        if (start && rowDate < start) return false;
        if (end) {
          const endDateTime = new Date(end);
          endDateTime.setHours(23, 59, 59, 999);
          if (rowDate > endDateTime) return false;
        }
      }
    }

    return true;
  });

  const handleStatusFilterClick = (status: "" | "Success" | "Pending" | "Failed") => {
    setSelectedStatus(status);
    onStatusFilterChange?.(status);
    setShowStatusDropdown(false);
  };

  const getFilterDisplayText = () => {
    if (selectedStatus) return selectedStatus;
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

  const handlePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setLocalPageSize(val);
    onPageSizeChange?.(val);
  };

  const renderPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
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
                onClick={() => handleStatusFilterClick("")}
              >
                All Projects
              </button>
              <button 
                className={styles.dropdownItem}
                onClick={() => handleStatusFilterClick("Success")}
              >
                Success
              </button>
              <button 
                className={styles.dropdownItem}
                onClick={() => handleStatusFilterClick("Pending")}
              >
                Pending
              </button>
              <button 
                className={styles.dropdownItem}
                onClick={() => handleStatusFilterClick("Failed")}
              >
                Failed
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
            <Image src={'/icon/emptyTable.svg'} alt="Empty Table" width={40} height={40} />
          </div>
          <p className={styles.emptyText}>No record found</p>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Project Name</th>
                  <th>Amount</th>
                  <th>Date Submitted</th>
                  <th>Date Approved</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const { color, bg } = statusConfig[row.status];
                  return (
                    <tr key={row.id}>
                      <td className={styles.indexCell}>{row.id}</td>
                      <td className={styles.nameCell}>{row.projectName}</td>
                      <td>{row.amount}</td>
                      <td>{row.dateSubmitted}</td>
                      <td>{row.dateApproved}</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{ color, backgroundColor: bg }}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                          <button
                            className={styles.actionBtn}
                            onClick={() => setOpenActionRowId(openActionRowId === row.id ? null : row.id)}
                          >
                            <LuEllipsisVertical size={18} color="#878787" />
                          </button>
                          {openActionRowId === row.id && (
                            <div className={styles.actionMenu}>
                              <button 
                                className={styles.actionMenuItem}
                                onClick={() => {
                                  row.onActionClick?.();
                                  setOpenActionRowId(null);
                                }}
                              >
                                View Details
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
              Showing 1 to {localPageSize} of {totalEntries} entries
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
                  onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <MdChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoanTable;