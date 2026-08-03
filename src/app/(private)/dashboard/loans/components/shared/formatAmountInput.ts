// Strips non-digits and re-inserts thousands separators as the user types,
// e.g. "1200000" / "1,2ab00,0 00" -> "1,200,000".
export const formatAmountInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
};
