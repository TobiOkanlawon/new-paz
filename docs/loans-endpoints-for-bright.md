# Loans Endpoints — For Bright Egbo to Review

This is the list I said I'd send after our call on 2026-07-12. It has three parts:

1. **Endpoints the frontend is already using** — please confirm each one is correct, or correct it if not.
2. **The exact data our UI still needs** (loan transactions table, loan summary, dashboard totals) — spelled out as field lists since we don't have real endpoints for these yet.
3. **Things I need from you** — the endpoints/answers behind part 2, plus a few other open questions.

Full internal write-up (business rules, code-level notes) lives in `docs/loans-backend-integration.md` if you want more context on any item — you don't need it to review this list.

**Updated 2026-07-22**: item 6 (admin-only `/v1/loans` routes) confirmed on a follow-up — thank you. Added items 13–16 (new endpoints found in a fresh Postman export: pending-requests list, `liquidate-loan`, `validate-loan`, `update-loan-product`) and expanded the guarantor question (item 4) since it turned out thinner than we'd like.

---

## Part 1 — Endpoints currently in use

For each one: what we send, what we expect back, and whether it's confirmed working or still a guess.

### 1. Start a loan application

```
POST /v1/loan/request/apply
```

**We send:**
```json
{
  "purpose": "string",
  "amount": 100000,
  "tenor": "30",
  "walletId": "string",
  "loanType": "PERSONAL_LOAN"
}
```
`loanType` is one of: `QUICK_LOAN`, `PERSONAL_LOAN`, `ASSET_FINANCE`, `LOCAL_PURCHASE_ORDER`.

**We expect back:**
```json
{
  "response": {
    "responseCode": "00",
    "responseMessage": "string",
    "responseData": { "nextId": "string" }
  }
}
```

**Status:** ✅ Working, in production use today.

---

### 2. Submit personal information (step of every wizard)

```
POST /v1/loan/request/update
```

**We send:**
```json
{
  "request": {
    "fullName": "string",
    "emailAddress": "string",
    "phoneNumber": "string",
    "dateOfBirth": "DD/MM/YYYY",
    "BVN": "string"
  },
  "nextId": "string (from the previous step's response)"
}
```

**We expect back:** same `{ response: { responseCode, responseMessage, responseData: { nextId } } }` shape as above, with a new `nextId` (we've seen this one come back prefixed `IPE-`).

**Status:** ✅ Working, in production use today.

---

### 3. Submit employment details (Quick Loan, Personal Loan)

```
POST /v1/loan/request/update
```

**We send:**
```json
{
  "request": {
    "monthlyIncome": 200000,
    "employmentStatus": "employed"
  },
  "nextId": "string"
}
```
`employmentStatus` values we send: `employed`, `self-employed`, `unemployed`.

**We expect back:** same shape, new `nextId` (seen prefixed `EMP-`).

**Status:** ✅ Working, in production use today.

---

### 4. Submit guarantor details (Personal Loan, Asset Finance)

```
POST /v1/loan/request/update
```

**We send:**
```json
{
  "request": {
    "name": "string",
    "phoneNumber": "string"
  },
  "nextId": "string"
}
```

**We expect back:** same shape, new `nextId` (seen prefixed `IGU-`).

**Status:** ⚠️ **200 OK, but likely under-collecting.** The call itself succeeds, but we're only sending two fields, and this feels thin for a real guarantor record. Specific questions:
- Are `name`/`phoneNumber` the exact field keys you expect, or should they be domain-prefixed like every other step (`guarantorName`/`guarantorPhoneNumber`, matching `businessName`/`assetName` elsewhere)?
- Do you also need guarantor `email`, `address`, `relationship` to the applicant, or an ID/BVN?
- Is the guarantor ever independently contacted (SMS/email) to confirm, or is this purely informational for admin review?
- Is this contract identical for Personal Loan and Asset Finance (we call it identically for both), or do you expect different data per loan type?
- What `nextId` prefix does this step's response carry? We need this to correctly detect "guarantor done, next is documents" in a resume-in-progress-application flow we just built.

---

### 5. Submit asset details (Asset Finance only)

```
POST /v1/loan/request/update
```

**We send:**
```json
{
  "request": {
    "assetName": "string",
    "assetAmount": 2000000
  },
  "nextId": "string"
}
```

**Status:** ⚠️ **Unconfirmed.** We built this as a best guess for the "Asset Type" step of Asset Finance — field names (`assetName`, `assetAmount`) have not been verified against your actual API. Please confirm or correct.

---

### 6. Submit company details (Local Purchase Order only)

```
POST /v1/loan/request/update
```

**We send:**
```json
{
  "request": {
    "businessName": "string",
    "businessEmail": "string",
    "businessPhone": "string",
    "cacNumber": "string"
  },
  "nextId": "string"
}
```

**Status:** ⚠️ **Unconfirmed.** Same as above — best guess for LPO's "Company's Information" step. Please confirm or correct field names, and confirm the backend actually recognizes this as a distinct step.

**Related question:** LPO's *Director's Information* step (item 2 above, reused) — is `dateOfBirth` actually required/used there at all? We previously sent it as an empty string by mistake (now fixed to send a real value), but we don't know if this step even needs it.

---

### 7. Submit loan consent (after admin approval)

```
POST /v1/loan/request/consent/:loanId
```

**We send:**
```json
{ "consent": true }
```

**Status:** ✅ Working, in production use today.

---

### 8. Check for a pending/active loan

```
GET /v1/user/loan/pending?walletId={walletId}
```

**We expect back (if a pending loan exists):**
```json
{
  "responseCode": "00",
  "responseMessage": "loan request successfully retrieved",
  "data": {
    "Amount": 0,
    "Approved": false,
    "ApprovedAmount": 0,
    "Consent": false,
    "Purpose": "string",
    "Tenor": "string",
    "OtherInfo": "string"
  }
}
```

**If none exists:**
```json
{ "responseCode": 400, "responseMessage": "no pending loan request found" }
```

**Status:** ✅ Working, in production use today. This is how we detect "loan approved, awaiting user consent."

---

### 9. Get account details (wallet, savings, loan balance)

```
GET /v1/users/user/account-details?email={email}
```

We understand from our call that the `email` param is ignored and you use the authenticated user's session email instead — we're still sending it as instructed.

**We expect back** a `totalLoan` field (0 or absent = user has no active loan), plus wallet/savings info.

**Status:** ✅ Working, in production use today. **Note:** on the call you referred to this as `GET /v1/user/account` — just flagging that the real path we're hitting is `/v1/users/user/account-details`, in case that's a naming mismatch on your side worth reconciling for the Swagger doc.

---

### 10. Get wallet balance (separate from #9)

```
GET /v1/users/user/fetch-account?email={email}
```

**We expect back** a `wallet` object with `walletId`, `availableBalance`, `totalBalance`, `currency`, etc. We use this specifically to get `walletId`, which endpoint #8 requires.

**Status:** ✅ Working, in production use today.

---

### 11. General wallet transactions (possible source for loan history — unconfirmed)

```
GET /v1/users/user/fetch-transactions?email={email}
```

**We expect back:**
```json
{
  "message": "string",
  "responseCode": "string",
  "transactions": [
    {
      "id": 1,
      "from_account": "string",
      "to_account": "string",
      "amount": 0,
      "currency": "string",
      "description": "string",
      "reference": "string",
      "status": "COMPLETED | FAILED",
      "created_at": "string"
    }
  ]
}
```

**Status:** ✅ Working (we already use this elsewhere for general wallet transaction history), but ⚠️ **not currently used on the Loans page, and we don't know if it includes loan disbursements/repayments as line items.** See question 7 below — this might turn out to be the same thing as the "loan transaction history" endpoint we're asking about in item 1, or it might be wallet-only. Need your confirmation either way.

---

### 12. Loan product creation (interest rate, fees — admin, one-way only so far)

```
POST /v1/loan/loan-product-creation
```

**Body we've seen in the collection:**
```json
{
  "productCode": "001",
  "narration": "pay day loan",
  "interestRate": "0.5",
  "managementFee": "0.01",
  "adminFee": "0.002",
  "productName": "PayDay"
}
```

**Status:** ⚠️ This looks like an admin-side "create a loan product" endpoint that defines interest rate and fees per product. We don't have (or use) any **GET** endpoint to read this back — see question 8 below, this is directly why we currently show a hardcoded interest rate on the loan-offer screen instead of the real one.

---

### 13. Pending loan *requests* list (new — distinct from item 8)

```
GET /v1/user/loan/request/pending?walletId={walletId}
```

You confirmed this route is live and fixed a missing `walletId` param on your side. What we still don't know: the response shape. Is it a list (plural "requests")? Does each item include a `loanType`? Does it carry a resumable step/`nextId`? We're currently only using array length (any pending request blocks new applications) — a sample response would let us do a lot more with this (e.g. show which loan type is pending, resume more precisely).

**Status:** ✅ Route confirmed live, ⚠️ response shape unknown.

---

### 14. Liquidate loan (new)

```
PUT /v1/loan/liquidate-loan
```

**Body we've seen in a Postman export:**
```json
{ "walletAccount": "", "amount": 0 }
```

We haven't called this yet. Please confirm: is `walletAccount` the wallet ID? Does `amount` need to be the full outstanding balance, or can it be a part-payment (per the part-payment rule you mentioned on the call)? What does a successful response look like? This is the piece we're missing to let a user actually close out their current loan before applying for a new one.

**Status:** ⚠️ Route seen, not yet used, payload unconfirmed.

---

### 15. Validate loan (new, purpose unclear)

```
POST /v1/loan/validate-loan
```

We found this route in a Postman export with an empty example body. We don't know what it's for — is it a BVN/eligibility pre-check before starting an application? A step in the approval flow? Please describe its purpose and expected payload.

**Status:** ⚠️ Route seen, purpose unknown, not yet used.

---

### 16. Update loan product (admin, new)

```
PUT /v1/loan/update-loan-product
```

**Body we've seen:**
```json
{ "interestRate": "", "managementFee": "", "adminFee": "", "tenor": "" }
```

Admin-only, not something we plan to call from this frontend, flagging only for completeness — there's no `productCode`/id in this body or the URL, so we're unsure how it identifies *which* product to update. Not a priority for us, just noting it exists.

---

## Part 1.5 — The exact data our UI needs (please map to your fields)

We don't have real endpoints for these two screens yet, so instead of guessing at a route, here's the exact shape our UI needs. Please tell us which endpoint(s) return this and what the real field names are.

### A. Loan transactions table (list of a user's loans, on the main Loans page)

One row per loan, with:

| Field | Example | Notes |
|---|---|---|
| `loanId` | `"12345"` | To link to a detail view |
| `loanType` | `"PERSONAL_LOAN"` | Same values as we send in `applyForLoan` (item 1 above): `QUICK_LOAN`, `PERSONAL_LOAN`, `ASSET_FINANCE`, `LOCAL_PURCHASE_ORDER` |
| `amount` | `500000` | Requested principal |
| `approvedAmount` | `450000` | May differ from requested — we already get this as `ApprovedAmount` from item 8 above |
| `purpose` | `"Business expansion"` | |
| `tenor` | `"90"` | |
| `dateApplied` | `"2026-07-01"` | |
| `dateApproved` | `"2026-07-03"` | |
| `status` | `"Pending" / "Approved" / "Active" / "Repaid" / "Rejected"` | Exact status values are up to you — just tell us what they are |
| `outstandingBalance` | `250000` | For active loans |

This is the same thing as item 1 in Part 2 below ("loan transaction history endpoint") — just spelled out as a field list instead of a vague ask.

### B. Loan summary (per-loan detail view / loan-offer screen)

We already get `Amount`, `ApprovedAmount`, `Tenor`, `Purpose`, `Approved`, `Consent` from item 8 above. Still missing:

| Field | Example | Notes |
|---|---|---|
| `interestRate` | `"5%/month"` | Currently hardcoded on our end — see item 12/question 8 above |
| `amountRepaid` | `100000` | Currently hardcoded to `—` |
| `outstandingBalance` | `350000` | |
| `nextDueDate` | `"2026-08-01"` | |
| `nextInstallmentAmount` | `50000` | |

### C. Dashboard summary cards (Total Borrowed, Outstanding Balance, Monthly Payment)

| Field | Example | Notes |
|---|---|---|
| `totalBorrowed` | `750000` | Sum across the user's loan(s) |
| `outstandingBalance` | `350000` | |
| `monthlyPayment` | `50000` | |
| `nextDueDate` | `"2026-08-01"` | |

This is the same underlying question as #A and item 7 in Part 2 below — we're not sure if it's one endpoint that covers A, B, and C, or several. Please tell us how it's actually split up on your side so we don't build three separate calls for what might be one response.

---

## Part 2 — What I need from you

1. **Loan transaction history endpoint.** We need a route that returns a user's list of past/current loans (empty list for new users) — the exact fields we need are spelled out in **Part 1.5, section A** above. This is how we plan to detect new vs. returning users and populate a loan history table. We couldn't pin this down live on the call — please send the route + a sample response when you can.

2. **Loan detail summary endpoint.** The per-loan detail shown in a loan history table/row. You mentioned this worked in a previous build but couldn't locate it live on the call. One guess on our side: `GET /v1/loans/:id` — can you confirm if that's it, or point us to the right one?

3. **Document upload contract.** We upload loan documents (ID, bank statement, etc.) directly to Cloudflare R2 from the frontend and get back a public URL. We need to know: which endpoint should receive that URL, and what field name(s) it expects. Our assumption is this extends `POST /v1/loan/request/update` (from #2 above) to accept a URL string instead of a raw file, keyed by `nextId` — but we haven't built anything against this yet, so tell us if that's wrong before we do.

4. **Swagger/OpenAPI doc.** Following up on the timeline for this whenever you have an update — no rush, just tracking it.

5. **Confirm endpoints #5 and #6 above** (asset details, company details) — these are our best guesses and could be silently sending the wrong field names.

6. ~~**Confirm `/v1/loans/` and `/v1/loans/:id` are admin-only**~~ — **confirmed, done.** Thanks — we won't call these from the frontend.

7. **Loan dashboard summary numbers — Total Borrowed, Outstanding Balance, Monthly Payment / next due date.** Exact fields we need are in **Part 1.5, section C**. These are currently hardcoded on our end (`NGN 0.00` placeholders) because we don't have a confirmed source for them. Specifically we need to know:
   - Does `GET /v1/users/user/account-details` (item 9 above) already carry these, or would we need to compute them client-side from something else?
   - Is `GET /v1/users/user/fetch-transactions` (item 11 above) the right place to pull loan disbursement/repayment line items from, or is there a loan-specific transactions endpoint we should be using instead? This question is related to #1 above and **Part 1.5 section A** — the "loan transaction history" endpoint and this "dashboard totals" need may end up being the same endpoint, or two different ones. Please clarify which.
   - For "Monthly Payment," is there a way to get the next due date and next installment amount for a user's active loan?

8. **Loan product terms (interest rate, fees) and full loan summary.** Exact fields we need are in **Part 1.5, section B**. We found `POST /v1/loan/loan-product-creation` in the collection (item 12 above), which looks like it defines `interestRate`, `managementFee`, and `adminFee` per loan product on your side. Is there a **GET** endpoint to read a product's terms back, or to read the actual interest rate/fees/amount-repaid that apply to a specific approved loan? Right now our loan-offer screen shows a hardcoded `5%/month` and `—` for amount repaid because we have nothing real to pull from.

9. **Guarantor step field contract** (item 4 above) — five specific questions listed there: exact field names, whether more fields are needed (email/address/relationship/ID), whether the guarantor is independently verified, whether Personal Loan and Asset Finance share one contract, and the step's output `nextId` prefix.

10. **LPO Director's Info — is `dateOfBirth` actually needed** for that step? (item 2/6 above)

11. **Response shape for the pending loan *requests* list** (item 13 above, `GET /v1/user/loan/request/pending`) — is it a list? Does each item carry `loanType`? A resumable step or `nextId`?

12. **Liquidate loan payload** (item 14 above) — confirm `walletAccount`/`amount` field meaning, whether part-payment amounts are accepted, and the success response shape.

13. **What is `POST /v1/loan/validate-loan` for** (item 15 above)? Route exists, purpose and payload are unknown to us.

---
