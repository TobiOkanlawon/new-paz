import type { LoanProduct } from "@/actions/loans";

// Common day-count breakpoints used to build a selectable tenure list under
// a product's max Tenor (fetch-loan-product returns Tenor as a single upper
// limit, not a range — these breakpoints are what let the user still pick a
// shorter term within that limit).
const TENURE_BREAKPOINTS_DAYS = [30, 60, 90, 120, 180, 270, 365];

export const findLoanProduct = (
  products: LoanProduct[],
  productName: string,
): LoanProduct | undefined =>
  products.find((product) => product.productName === productName);

// Builds "X days" options up to and including maxTenorDays. Falls back to a
// static option list (the previous hardcoded values) if the product wasn't
// found/fetched yet, so the field is never left with no options.
export const buildTenureOptions = (
  maxTenorDays: number | undefined,
  fallback: string[],
): string[] => {
  if (!maxTenorDays || maxTenorDays <= 0) return fallback;

  const options = TENURE_BREAKPOINTS_DAYS.filter((days) => days < maxTenorDays);
  options.push(maxTenorDays);

  return options.map((days) => `${days} days`);
};

// Strips a " days" suffix from tenure strings like "90 days" -> "90" before
// sending to the API.
export const parseTenureDays = (value: string): string =>
  value.replace(/\s*days?/i, "").trim();

// "Up to X days" label for the Available Loans cards, falling back to a
// static label if the product wasn't found/fetched yet.
export const formatTenureRange = (
  maxTenorDays: number | undefined,
  fallback: string,
): string => (maxTenorDays && maxTenorDays > 0 ? `Up to ${maxTenorDays} days` : fallback);
