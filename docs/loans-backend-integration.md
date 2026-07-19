# Loans — Backend Integration Notes

## Overview

This is **not an official API spec**. There is no Swagger/OpenAPI documentation yet — the backend engineer (Bright Egbo) has agreed to produce one but it will take time. Until that exists, this document is the source of truth for how the Loans frontend integrates with the backend.

It was compiled from:
- A call with Bright Egbo on 2026-07-12 covering eligibility rules, business rules, and known payload bugs.
- A scan of the current codebase (`src/actions/loans.ts`, `src/actions/dashboard.ts`, the loans dashboard components, the loans data hooks, and the Bruno API collection under `api/PAZ-BACKEND-APIS/LOANS/` and `api/PAZ-BACKEND-APIS/USERS/`).

Purpose:
1. Stop re-asking questions that are already answered.
2. Let any frontend dev (or future you) integrate without another call.
3. Clearly separate **confirmed and working** from **pending / unresolved**.

Anything below marked *"inferred, not confirmed by backend"* was found in code or the Bruno collection but was not explicitly discussed on the call — treat it as best-effort until verified.

---

## Confirmed Endpoints

### Loan application flow

| Method | Path | Used by (code) | Auth | Notes |
|---|---|---|---|---|
| POST | `/v1/loan/request/apply` | `applyForLoan` — `src/actions/loans.ts` | Bearer | Body: `{ purpose, amount, tenor, walletId, loanType }`. Returns `{ nextId }`. First step of every loan wizard (Quick, Personal, Asset Finance, LPO). |
| POST | `/v1/loan/request/update` | `submitLoanPersonalInfo`, `submitLoanEmploymentDetails`, `submitLoanGuarantorDetails`, `submitLoanAssetDetails`, `submitLoanCompanyDetails` — `src/actions/loans.ts` | Bearer | Body: `{ request: { ...stepFields }, nextId }` (JSON only — see [Known Issues](#known-issues-to-fix)). Returns a new `nextId` each call; observed prefixes: `IPE-` (personal info), `EMP-` (employment), `IGU-` (guarantor). Each loan type calls a different subset of these depending on its wizard steps. |
| POST | `/v1/loan/request/consent/:loanId` | `submitLoanConsent` — `src/actions/loans.ts`; `useConsentToLoan` — `src/data/mutations/useConsentToLoan.ts` | Bearer | Body: `{ consent: boolean }`. Called after admin approval, from `LoanConsentModal`. |
| GET | `/v1/user/loan/pending?walletId=` | `getPendingLoan` — `src/actions/loans.ts`; `useGetLoanStatus` — `src/data/queries/useGetLoanStatus.ts` | Bearer | Confirmed live and working. Returns the user's pending/active loan request (`Amount`, `Approved`, `ApprovedAmount`, `Consent`, `Purpose`, `Tenor`, `OtherInfo`), or a "no pending loan request found" response. Drives the consent modal and resume-flow logic. **Two independent implementations exist** — see [Known Issues](#known-issues-to-fix). |

### Account / eligibility

| Method | Path | Used by (code) | Auth | Notes |
|---|---|---|---|---|
| GET | `/v1/users/user/account-details?email=` | `getAccountSummary` — `src/actions/dashboard.ts`; `useGetAccountDetails` — `src/data/queries/useGetAccountDetails.ts` | Bearer | This is the endpoint Bright referred to on the call as "account details" / `GET /v1/user/account` — **the actual path in code and the Bruno collection is `/v1/users/user/account-details`**, not `/v1/user/account`. The `email` query param is required but the backend ignores it and uses the authenticated user's email regardless (security measure) — still send it. Response includes `totalLoan` (0/absent ⇒ user has no active loan), plus wallet/savings fields (`bankAccount`, `familyVault`, `soloSavings`, `targetSavings`, `investmentAmount`, etc. — see `TAccountDetails` in `types.d.ts`). |
| GET | `/v1/users/user/fetch-account?email=` | `useGetWallet` — `src/data/queries/useGetWallet.ts` | Bearer | A **different, older** wallet-only endpoint (`currency`, `availableBalance`, `totalBalance`, `lienAmount`, `walletId`, `accountType`). Used to resolve `walletId`, which the loan-pending endpoint requires. Not part of the loans call, but the loans flow depends on it. |

### Admin-only (not for this frontend)

| Method | Path | Source | Notes |
|---|---|---|---|
| GET | `/v1/loans/` | `api/PAZ-BACKEND-APIS/LOANS/GET LOANS.bru` (not called from app code) | Confirmed admin-only per the call. Do not use on the loans frontend. |
| GET | `/v1/loans/:id` | `api/PAZ-BACKEND-APIS/LOANS/GET LOAN.bru` (not called from app code) | *Inferred, not confirmed by backend.* Possibly the historic "loan detail summary" route Bright mentioned as "seen working in a prior build" but couldn't locate live on the call — worth testing against as a first guess when following up (see [Pending](#whats-still-pending--blocked)). |
| POST | `/v1/loan/request/approval/:id` | `api/PAZ-BACKEND-APIS/LOANS/LOAN APPROVAL -ADMIN.bru` | Admin loan approval. Hardcodes `http://localhost:4000` instead of the templated `{{url}}` — collection drift, not a frontend concern but flagged for hygiene. |
| POST | `/v1/loan/loan-product-creation` | `api/PAZ-BACKEND-APIS/LOANS/LoanProducts.bru` (not called from app code) | Admin-side loan product creation — body includes `productCode`, `narration`, `interestRate`, `managementFee`, `adminFee`, `productName`. *Inferred, not confirmed by backend.* No GET counterpart exists in the collection or codebase, so there's currently no way for the frontend to read real interest rate/fee terms — this is why `LoanConsentModal` hardcodes `5%/month` (see [Known Issues](#known-issues-to-fix) #7). Need to ask Bright whether a read endpoint exists. |

### Wallet / general transactions (candidate source for loan dashboard data — unconfirmed)

| Method | Path | Used by (code) | Auth | Notes |
|---|---|---|---|---|
| GET | `/v1/users/user/fetch-transactions?email=` | `getAllTransactions` — `src/actions/transactions.ts` | Bearer | Returns a flat list of wallet transactions (`from_account`, `to_account`, `amount`, `status`, `created_at`, etc.). Already used elsewhere in the app for general wallet transaction history, but **not currently wired into the Loans dashboard**, and it's unconfirmed whether loan disbursements/repayments appear here as line items. Candidate source for the missing loan-transaction-history / dashboard-totals data — needs backend confirmation (see [Pending](#whats-still-pending--blocked)). |

### Document upload flow (confirmed correct)

1. User selects a file in a loan wizard's document step.
2. Frontend uploads it directly to Cloudflare R2 via `uploadLoanDocumentAction` (`src/actions/uploadLoanDocuments.ts` → `uploadLoanDocument` in `src/libs/cloudflare.ts`), which returns a public `r2.dev` URL.
3. The URL is meant to be sent to the backend as part of the loan application payload.

Step 3 is **not implemented yet** — see [Known Issues](#known-issues-to-fix) and [Pending](#whats-still-pending--blocked).

---

## Business Rules

- **Single active loan**: a user cannot have more than one active loan at a time. They must fully liquidate the current loan before applying for a new one. Not enforced anywhere in the frontend today.
- **Loan purpose is required** by the backend and must become a dropdown with fixed options (e.g. Education, Housing, Business, Other) — currently free text everywhere.
- **Part payments** are allowed before the due date. On the due date, the full remaining balance is expected; there's no defined partial-payment leniency after that. Note: due-date enforcement is Bright's own working assumption, not a confirmed backend spec — don't over-build around it.
- **Loan limit increases** (e.g. 50k → 100k progression after repayment history): no backend "loan engine" or computation exists for this yet. Design mockups showing limit progression are not backed by real data — deprioritize, don't build against real numbers.
- **Eligibility gate**: BVN validation is the primary gate — loan actions fail if BVN isn't set up. Age is not enforced by the backend. Valid phone/email are already guaranteed by onboarding, no need to re-validate. Proof of income / NIN are only required for the loan types that call for them, not universally.
- **Creditworthiness** is resolved via a credit bureau integration exposed only to the admin dashboard. The loans frontend does not need to display or check this.

---

## Known Payload Requirements

A 200 response from `/v1/loan/request/apply` or `/v1/loan/request/update` does **not** guarantee the payload was complete on the backend side — these fields were found empty/missing in prior test payloads and must be double-checked whenever wizard code changes:

- `employmentStatus` (e.g. `"employed"`, `"self-employed"`) — previously sent as an empty string due to a frontend bug.
- Personal info: `email`, `dateOfBirth`, `phoneNumber` — found empty in a prior test payload.
- `loanPurpose` — found missing entirely in one test (this is also why it needs to become a dropdown, not free text).

Also note: backend Redis caching can cause stale/duplicate-looking behavior when the same loan `nextId`/loan ID is retried repeatedly in quick succession during testing — if requests seem "stuck," this may be why, not a frontend bug.

---

## What's Implemented on the Frontend Today

All loan wizards live under `src/app/(private)/dashboard/loans/components/modals/` and share `src/actions/loans.ts` for the multi-step apply flow, plus `usePersonalInfoPrefill` (`components/shared/usePersonalInfoPrefill.ts`) to prefill name/email/phone/DOB from the user's profile (BVN is intentionally never prefilled — it isn't persisted after verification).

| Loan type | Wizard steps | Document upload | Status |
|---|---|---|---|
| Quick Loan (`ApplyQuickLoanModal`) | Loan Details → Employment → Personal Info | None (not required for this loan type) | Fully wired, submits and closes on success. |
| Personal Loan (`ApplyPersonalLoanModal`) | Loan Details → Employment → Personal Info → Guarantor → Documents | Identity Proof, Account Proof — uploads to R2, URL held in local state only | Wired through submission; document URLs not sent to backend (see below). |
| Asset Finance (`AssetFinanceLoanModal`) | Loan Details → Asset Type → Personal Info → Guarantor → Documents | Identity Proof, Account Proof, Asset Proof — uploads to R2, URL held in local state only | Wired through submission; also renders a "Make Payment" button on the documents step wired to the empty-state `MakePaymentModal`. Document URLs not sent to backend. Asset Type step (`submitLoanAssetDetails`) is a best-effort field-name guess, unconfirmed by backend. |
| Local Purchase Order (`LocalPurchaseOrderModal`) | Loan Details → Director's Info → Company's Info → Documents | LPO Proof, Address Proof — uploads to R2, URL held in local state only | Wired through submission. Company's Info step (`submitLoanCompanyDetails`) is a best-effort field-name guess, unconfirmed by backend. Document URLs not sent to backend. |
| Business Loan (`BusinessLoanModal`) | Menu only — routes to LPO / Asset Finance / Project Finance | — | Just a selector; Project Finance option is marked `comingSoon: true`. |
| Project Finance | — | — | `ApplyProjectFinanceLoanModal` has no state/API wiring (static form). The `/dashboard/loans/project-finance` page only renders an empty state; the real `ProjectFinance` component is commented out and built on hardcoded mock data. |

Loan status / consent (post-submission):
- `getPendingLoan` / `useGetLoanStatus` poll `/v1/user/loan/pending`.
- `LoanConsentModal` shows an "approved" screen and calls `submitLoanConsent` / `useConsentToLoan` when the user accepts.

---

## Expected Data Shapes (Not Yet Backed by a Real Endpoint)

Two pieces of UI need real loan data and currently have **no confirmed backend source and no correctly-shaped frontend type either** — these are placeholders/mock shapes borrowed from other features, not a deliberate contract. Documented here so whoever wires them up (us) and whoever confirms the data (Bright) are working from the same field list.

### Loan transactions table (main Loans dashboard)

Rendered by `LoansClient` → `TransactionsTable`, currently always passed `rows={[]}`. Its row type, `TransactionRow` (`src/components/TransactionTable/TransactionTable.tsx`), is **savings-shaped** (`savingsName`, `amountTarget`, `savingsAmount`, `savingsInterest`, `amountDebited`, `dateDebited`, `status`) — reused from the savings feature, not built for loans. It has no `loanType` field at all.

Fields we actually need per row:
- `loanId` — to link to the loan detail/summary view
- `loanType` — e.g. Quick Loan / Personal Loan / Business Loan / Local Purchase Order / Asset Finance / Project Finance
- `amount` — requested principal
- `approvedAmount` — may differ from requested (seen in `/v1/user/loan/pending` as `ApprovedAmount`)
- `purpose`
- `tenor`
- `dateApplied`
- `dateApproved`
- `status` — Pending / Approved / Active / Repaid / Rejected (exact enum unconfirmed)
- `outstandingBalance` — for active loans

### Loan summary (per-loan detail)

Two components render a generic label/value list without any typed loan shape: `LoanDetailsModal` (title literally "Loan Summary") and `LoanConsentModal`'s approval screen. Neither is currently wired to real per-loan data beyond what `/v1/user/loan/pending` already returns (`Amount`, `ApprovedAmount`, `Tenor`, `Purpose`, `Approved`, `Consent`).

Fields still missing to make these complete:
- `interestRate` — hardcoded `5%/month` today (see [Known Issues](#known-issues-to-fix) #7); needs a real source, likely tied to the loan-product endpoint (see [Confirmed Endpoints](#confirmed-endpoints))
- `amountRepaid` — hardcoded `—` today
- `outstandingBalance`
- `nextDueDate`
- `nextInstallmentAmount`

### Dashboard summary cards (Total Borrowed / Outstanding Balance / Monthly Payment)

`LoanCard` (`src/app/(private)/dashboard/loans/components/loanCard/LoanCard.tsx`) is a display-only component — whatever `amount`/`bottomRight` strings it's given, it shows. Currently hardcoded in `emptyDashboard/page.tsx`. Needs:
- `totalBorrowed` — likely a sum across the user's active loan(s)
- `outstandingBalance`
- `monthlyPayment` amount + `nextDueDate`
- active loan count (for copy like "Across N active loans" — note this phrasing itself needs to change once the single-active-loan rule is enforced, see Known Issues #1)

None of the above have a confirmed backend source yet — see the two new rows added to [Pending / Blocked](#whats-still-pending--blocked) and questions 7–8 in `docs/loans-endpoints-for-bright.md`.

---

## Known Issues to Fix

1. **Single active loan rule is not enforced.** Every "apply" entry point (Quick Loan, Personal Loan, Business Loan → LPO/Asset Finance) is always available regardless of whether the user already has an active loan — there's no check against `totalLoan` (from `getAccountSummary()`) or loan status before opening an apply modal. The dashboard stat card even hardcodes copy implying multiple simultaneous loans are normal: `bottomRight="Across two active loans"` in [`emptyDashboard/page.tsx`](src/app/(private)/dashboard/loans/components/emptyDashboard/page.tsx#L184). This directly contradicts the confirmed single-active-loan rule and needs fixing.

2. **Loan purpose is free text everywhere, not a dropdown.** All four wizards (`ApplyPersonalLoanModal`, `ApplyQuickLoanModal`, `AssetFinanceLoanModal`, `LocalPurchaseOrderModal`) use a plain `LoanInput` for `loanPurpose`. Needs to become a `LoanSelect` dropdown with fixed options (Education, Housing, Business, Other, etc.) — this is also one of the confirmed "found missing in testing" fields.

3. **Uploaded document URLs never reach the backend.** Cloudflare R2 upload genuinely works (byte-for-byte verified) and the resulting URL is captured into each modal's local state, but the final submit step in `ApplyPersonalLoanModal`, `AssetFinanceLoanModal`, and `LocalPurchaseOrderModal` only checks the URL exists locally, then closes the wizard — nothing sends it to the backend/DB. Blocked on backend confirmation of which endpoint/field names to use (see [Pending](#whats-still-pending--blocked)) — don't build this until that comes back.

4. ~~**Root `/dashboard/loans` page hardcodes the eligibility gate.**~~ **Fixed 2026-07-13.** `page.tsx` is now an async Server Component that calls `getAccountSummary()` and shows `EmptyDash` when `totalLoan` is truthy, `EmptyInstant` (eligibility screen) otherwise — matching the confirmed rule that `totalLoan` 0/absent means no active loan. The interactive state (which screen is showing, whether to auto-open the apply modal) was extracted into a new client component, `components/LoanDashboardClient.tsx`, seeded with the server-fetched `initialHasActiveLoan` value. If `getAccountSummary()` fails (no session, API error), it now falls back to showing the eligibility screen rather than crashing. Note: passing eligibility client-side (via `EligibilityModal`) still only flips local state for the current session — it doesn't (and can't yet) change what the backend reports on next page load, since there's no known endpoint that persists "user passed eligibility" server-side.

5. **Hardcoded dashboard stats.** "Total Borrowed," "Outstanding Balance," and "Monthly Payment" cards in `emptyDashboard/page.tsx` show static `NGN 0.00` and fake trailing text (e.g. "Next due: Mar 1, 2026") — not sourced from `getAccountSummary()`.

6. **`LoansClient` always renders an empty transaction table.** `rows={[]}` is hardcoded in `emptyDashboard/page.tsx` — no real loan-history data source is wired. Partially blocked on the pending loan-transaction-history endpoint (see below).

7. **`LoanConsentModal` has hardcoded loan terms.** [`LoanConsentModal.tsx`](src/app/(private)/dashboard/loans/components/modals/LoanConsentModal/LoanConsentModal.tsx#L74) hardcodes `"Interest rate: 5%/month"` regardless of the actual approved loan's terms, and `"Amount Repaid: —"` (line 83) is never populated from real data. Also has a leftover debug `console.log("loan/pending response:", ...)` at line 27.

8. **Dead/broken code not yet removed:**
   - `submitLoanDocumentsAction` (`src/actions/submitLoanDocuments.ts`) sends documents as raw multipart to `/v1/loan/request/update` — confirmed broken, since that path only accepts JSON and returns an HTML error page for multipart requests. Not called anywhere in the current wizards (all three document flows now use the Cloudflare-upload pattern instead) but not deleted either.
   - `useApplyForLoan` (`src/data/mutations/useApplyForLoan.ts`) posts `{ productName, walletId, amount, duration, purpose }` to `/v1/loan/request/apply` — field names (`productName`/`duration`) don't match what the live `applyForLoan` server action actually sends (`loanType`/`tenor`). Not called from any component.
   - `src/app/(private)/dashboard/loans/actions.ts` near-duplicates `src/actions/loans.ts` and is unused.

9. **LPO has a leftover debug `console.log(result)`** in the step-0 error handler in [`LocalPurchaseOrderModal.tsx`](src/app/(private)/dashboard/loans/components/modals/LocalPurchaseOrderModal/LocalPurchaseOrderModal.tsx#L193).

10. **Two parallel data-fetching approaches**, not unified: server actions (`src/actions/loans.ts`, `src/actions/dashboard.ts`) vs. React Query/axios hooks (`useGetLoanStatus`, `useConsentToLoan`, `useGetAccountDetails`, `useGetWallet`, and the unused `useApplyForLoan`). Both `getPendingLoan` and `useGetLoanStatus` independently call the same `/v1/user/loan/pending` endpoint.

11. **Bruno collection drift:** `LOAN APPLICATION_1.bru`'s body (`productName`, `duration`) matches the *dead* `useApplyForLoan` hook, not the live `applyForLoan` action (`loanType`, `tenor`) — should be updated or removed to avoid confusing future integration work. The admin approval endpoint hardcodes `http://localhost:4000` instead of the templated `{{url}}`.

12. **No payment logic.** `MakePaymentModal` / `RepayLoanModal`'s `onPay`/`onRepay` callbacks are no-ops — the confirmed part-payment business rule has no frontend implementation yet.

13. **No loan-shaped table type exists yet.** `TransactionRow` (used by the main Loans transactions table) is borrowed from the savings feature and has no `loanType`, `purpose`, `tenor`, or `outstandingBalance` fields; `LoanRow` (used by `LoanTable`, the Project Finance table) is borrowed from a project-tracking shape (`projectName`, `dateSubmitted`, `dateApproved`) and also has no `loanType`. Both need a real loan-specific row type once the backend data source is confirmed — see [Expected Data Shapes](#expected-data-shapes-not-yet-backed-by-a-real-endpoint).

14. **Project Finance is entirely unbuilt** — `ApplyProjectFinanceLoanModal` has no state/API wiring, and the `project-finance` page renders only an empty state (real component commented out, built on mock data anyway). `BusinessLoanModal` marks it `comingSoon`.

---

## What's Still Pending / Blocked

| Item | Owner | Notes |
|---|---|---|
| Exact route + response shape for the **loan transaction history** endpoint (new vs. returning user detection, loan history table) | Bright Egbo | Not located/confirmed live on the call. No matching route found anywhere in the current codebase or Bruno collection either — this is a genuine gap, not just an undocumented route. |
| **Swagger/OpenAPI documentation** | Bright Egbo | Agreed to produce, will take time. Not available yet. |
| Exact route for the **loan detail summary** (per-loan model shown in the UI table) | Bright Egbo | Seen working in a prior build; couldn't be located live on the call. `GET /v1/loans/:id` (Bruno `GET LOAN.bru`) is an unconfirmed candidate — worth testing first. |
| Full list of loans endpoints (all loan types combined), formally confirmed by the backend | Me → Bright Egbo | I'm compiling my own list of endpoints currently relied on (this doc's [Confirmed Endpoints](#confirmed-endpoints) table) to send him for correction/confirmation. |
| Which endpoint/field names should receive uploaded document URLs | Me → Bright Egbo | Likely extending `POST /v1/loan/request/update` to accept URL strings instead of raw multipart files, keyed by `nextId` — unconfirmed. Don't build the "send URL to backend" wiring until this comes back. |
| Backend contract for Asset Finance's "Asset Type" step and LPO's "Company's Information" step | Bright Egbo | Both `submitLoanAssetDetails` and `submitLoanCompanyDetails` are best-effort field-name guesses (`assetName`/`assetAmount`, `businessName`/`businessEmail`/`businessPhone`/`cacNumber`), not verified against the real backend. Error toasts during testing are the signal to watch for. |
| Source for loan dashboard totals (Total Borrowed, Outstanding Balance, Monthly Payment / next due date) | Bright Egbo | Currently hardcoded in `emptyDashboard/page.tsx` — no confirmed source exists. Unclear whether `account-details` already carries these, whether `fetch-transactions` (general wallet transactions) includes loan line items, or whether this needs a dedicated endpoint (possibly the same one as the pending loan-transaction-history item above). |
| GET endpoint to read real loan product terms (interest rate, fees) | Bright Egbo | `POST /v1/loan/loan-product-creation` (admin, write-only) defines `interestRate`/`managementFee`/`adminFee` per product, but no read-back endpoint has been found. This is why `LoanConsentModal` currently hardcodes `5%/month` (see Known Issues #7). |

---

## Next Actions

- [ ] Send Bright Egbo the compiled endpoint list (this doc's Confirmed Endpoints table) for confirmation/correction.
- [ ] Follow up on the loan transaction history endpoint (new vs. returning user detection, loan history table).
- [ ] Follow up on the loan detail summary route (try `GET /v1/loans/:id` as a first guess).
- [ ] Follow up on the Swagger/OpenAPI doc timeline.
- [ ] Follow up on which endpoint/field names should receive document URLs, then wire it up (currently blocked — do not build ahead of this).
- [ ] Update `loanPurpose` fields across all four wizards from free text to a fixed-option dropdown.
- [ ] Remove/gate the UI paths that let a user open a new loan application while they already have an active loan (single active loan rule).
- [ ] Wire the root `/dashboard/loans` eligibility gate and the dashboard stat cards to real `getAccountSummary()` data instead of hardcoded values.
