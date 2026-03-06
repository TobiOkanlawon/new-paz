import React, { useMemo, useState } from "react";
import styles from "./transactionsTable.module.css";

export type TxStatus = "Success" | "Pending" | "Failed" | "Reversed" | string;

export type TransactionRow = {
  id: string;
  savingsName: string;
  amountTarget: number;
  savingsAmount: number;
  savingsInterest: string; // e.g. "12%"
  amountDebited: number;   // positive number
  dateDebited: string;     // e.g. "Mon, 21 Dec 2025"
  status: TxStatus;
};

type Props = {
  rows: TransactionRow[];
  currency?: string; // default ₦

  // Pagination
  page: number; // 1-indexed
  pageSize: number;
  total: number; // total rows count (for server pagination too)
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  // Optional filter control (if true, shows built-in filter UI)
  showFilter?: boolean;
  
  // Optional header controls (filters, date range, etc)
  leftControls?: React.ReactNode;
  rightControls?: React.ReactNode;

  className?: string;
};

const formatMoney = (value: number, currency: string) => {
  const formatted = value.toLocaleString("en-NG", { maximumFractionDigits: 0 });
  return `${currency}${formatted}`;
};

const getStatusClass = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("success")) return "success";
  if (s.includes("pending")) return "pending";
  if (s.includes("fail") || s.includes("error")) return "failed";
  if (s.includes("revers")) return "reversed";
  return "neutral";
};

const TransactionsTable = ({
  rows,
  currency = "₦",
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  showFilter = true,
  leftControls,
  rightControls,
  className,
}: Props) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rows based on status and search
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesStatus =
        statusFilter === "all" ||
        row.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        row.savingsName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [rows, statusFilter, searchTerm]);

  const filteredTotal = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));

  // Paginate filtered rows
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const startIndex = filteredTotal === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, filteredTotal);

  const pageNumbers = useMemo(() => {
    // simple: show 1..3, ... last (can be upgraded later)
    const arr: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
      return arr;
    }
    arr.push(1);
    if (page > 3) arr.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      arr.push(i);
    }
    if (page < totalPages - 2) arr.push("...");
    arr.push(totalPages);
    return arr;
  }, [page, totalPages]);

  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      <div className={styles.controls}>
        <div className={styles.left}>
          {showFilter && !leftControls && (
            <div className={styles.filterGroup}>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  onPageChange(1); // Reset to page 1 when filtering
                }}
                className={styles.searchInput}
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  onPageChange(1); // Reset to page 1 when filtering
                }}
                className={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="reversed">Reversed</option>
              </select>
            </div>
          )}
          {leftControls}
        </div>
        <div className={styles.right}>{rightControls}</div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Savings Name</th>
              <th className={styles.mobileHidden}>Amount Target</th>
              <th>Savings Amount</th>
              <th className={styles.mobileHidden}>Savings Interest</th>
              <th className={styles.mobileHidden}>Amount Debited</th>
              <th className={styles.mobileHidden}>Date Debited</th>
              <th className={styles.mobileHidden}>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.emptyCell}>
                  No transactions found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((r, idx) => {
                const sn = (page - 1) * pageSize + (idx + 1);
                const statusClass = getStatusClass(r.status);

                return (
                  <tr key={r.id}>
                    <td>{sn}</td>
                    <td className={styles.nameCell}>{r.savingsName}</td>
                    <td className={styles.mobileHidden}>
                      {formatMoney(r.amountTarget, currency)}
                    </td>
                    <td>{formatMoney(r.savingsAmount, currency)}</td>
                    <td className={styles.mobileHidden}>{r.savingsInterest}</td>
                    <td className={`${styles.mobileHidden} ${styles.amountDebited}`}>
                      +{formatMoney(r.amountDebited, currency)}
                    </td>
                    <td className={styles.mobileHidden}>{r.dateDebited}</td>
                    <td className={styles.mobileHidden}>
                      <span className={`${styles.pill} ${styles[statusClass]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button type="button" className={styles.actionsBtn} aria-label="More actions">
                        <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="2" cy="2" r="2" fill="#6B7280"/>
                          <circle cx="2" cy="8" r="2" fill="#6B7280"/>
                          <circle cx="2" cy="14" r="2" fill="#6B7280"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <span className={styles.muted}>
              Showing {startIndex} to {endIndex} of {filteredTotal} entries
            </span>

            <div className={styles.pageSizeWrap}>
              <span className={styles.muted}>Show</span>
              <select
                className={styles.select}
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
              >
                {[8, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              type="button"
            >
              ‹
            </button>

            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className={styles.dots}>
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={`${styles.pageNum} ${p === page ? styles.activePage : ""}`}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </button>
              )
            )}

            <button
              className={styles.pageBtn}
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;