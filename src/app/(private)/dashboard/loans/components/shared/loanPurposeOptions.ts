// Fixed-option lists for the "Purpose of Loan" field, tailored per loan
// product rather than shared across all wizards. Backend confirmed
// loanPurpose must be a fixed dropdown, not free text, but the exact option
// set per product is not backend-enforced/confirmed — these are reasonable
// starting lists per product's actual use case. Every list ends with "Other"
// so a purpose that doesn't fit is never a dead end.

export const QUICK_LOAN_PURPOSE_OPTIONS = [
  "Emergency Expenses",
  "Bills Payment",
  "Personal Upkeep",
  "Debt Consolidation",
  "Other",
];

export const PERSONAL_LOAN_PURPOSE_OPTIONS = [
  "Education",
  "Medical / Healthcare",
  "Rent / Housing",
  "Wedding / Ceremony",
  "Travel",
  "Debt Consolidation",
  "Other",
];

export const LPO_LOAN_PURPOSE_OPTIONS = [
  "Inventory / Stock Purchase",
  "Raw Materials",
  "Order Fulfillment",
  "Equipment Purchase",
  "Other",
];

export const ASSET_FINANCE_PURPOSE_OPTIONS = [
  "Vehicle Purchase",
  "Machinery / Equipment",
  "Office Equipment",
  "Property / Real Estate",
  "Other",
];
