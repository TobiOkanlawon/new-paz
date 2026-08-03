"use server";

import { getServerSession } from "next-auth";
import { ok, fail, ActionResult } from "@/actions/shared";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/libs/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

type LoanUpdateApiResponse = {
  response: {
    responseCode: string;
    responseMessage: string;
    responseData: {
      nextId: string;
    };
  };
};

export type LoanUpdateResponse = {
  nextId: string;
};

type LoanApplyApiResponse = {
  response: {
    responseCode: string;
    responseMessage: string;
    responseData: {
      nextId: string;
    };
  };
};

export type LoanApplyResponse = {
  nextId: string;
};

type LoanConsentApiResponse = {
  responseCode: string;
  responseMessage: string;
};

export type LoanConsentResponse = {
  success: boolean;
  message: string;
};

// ---------------------------------------------------------------------------
// GET /v1/user/loan/pending?walletId={walletId}
// Retrieve pending loan request (used to resume abandoned requests)
// Success response example (in-progress application, not yet disbursed):
// {
//   "data": { ... },
//   "responseCode": "00",
//   "responseMessage": "loan request successfully retrieved"
// }
// Success response example (already approved & disbursed loan):
// {
//   "loan": { "AmountDisbursed": 50000, "TotalPayable": 50000, ... },
//   "responseCode": "00",
//   "responseMessage": "Successfully retrieved"
// }
// No-pending response example:
// {
//   "responseCode": 400,
//   "responseMessage": "no pending loan request found"
// }

export type PendingLoanData = {
  Amount: number;
  Approved: boolean;
  ApprovedAmount: number;
  Consent: boolean;
  Purpose: string;
  Tenor: string;
  OtherInfo: string; // e.g. nextId like IPE-6977222064
};

export type ActiveLoanData = {
  AmountLiquidated: number;
  TotalPayable: number;
  AmountDisbursed: number;
  BookDate: string;
  MaturityDate: string;
  ProductName: string;
  Tenor: string;
  InterestRate: string;
  MonthlyPayment: number;
};

type PendingLoanApiResponse = {
  responseCode: string | number;
  responseMessage?: string;
  data?: PendingLoanData;
  loan?: ActiveLoanData;
};

export type PendingLoanResponse = {
  pending: boolean;
  data?: PendingLoanData;
  loan?: ActiveLoanData;
  message?: string;
};

// ---------------------------------------------------------------------------
// Step 1 — Apply for the loan
// POST /v1/loan/request/apply
// ---------------------------------------------------------------------------

export interface ApplyForLoanPayload {
  purpose: string;
  amount: number;
  tenor: string;
  loanType: string;
}

export async function applyForLoan(
  payload: ApplyForLoanPayload,
): Promise<ActionResult<LoanApplyResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    // session.user.walletAccount is captured once at login and never
    // refreshed — a user who links their wallet/account after logging in
    // (e.g. via the account-setup gate) keeps a stale/empty value for the
    // rest of that session, which JSON.stringify then drops from the
    // request body entirely. Fetch the current value instead, same as
    // addAccount() in src/actions/preAuth.ts does for the same reason.
    const updatedUser = await apiFetch<any>("/v1/users/fetch/user", {
      isProtected: true,
      method: "POST",
      body: { email: session.user.email },
    });

    const walletId = updatedUser?.user?.wallet_account;

    if (!walletId) {
      return fail("Wallet account is missing on your profile. Please complete account setup first.");
    }

    const body = {
      purpose: payload.purpose,
      amount: payload.amount,
      tenor: payload.tenor,
      walletId,
      loanType: payload.loanType,
    };

    const res = await apiFetch<LoanApplyApiResponse>("/v1/loan/request/apply", {
      method: "POST",
      isProtected: true,
      body,
    });

    const code = res?.response?.responseCode;
    const message = res?.response?.responseMessage;
    const nextId = res?.response?.responseData?.nextId;

    if (code !== "00") {
      return fail({
        success: false,
        error: new Error(message || "Failed to apply for loan"),
      });
    }

    return ok({ nextId: nextId });
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------------------
// Step 2 — Submit personal information
// POST /v1/loan/request/update  (nextId prefix: IPE-)
// ---------------------------------------------------------------------------

export interface SubmitPersonalInfoPayload {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  dateOfBirth: string; // format: DD/MM/YYYY
  BVN: string;
  nextId: string; // returned from Step 1
}

export async function submitLoanPersonalInfo(
  payload: SubmitPersonalInfoPayload,
): Promise<ActionResult<LoanUpdateResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const body = {
      request: {
        fullName: payload.fullName,
        emailAddress: payload.emailAddress,
        phoneNumber: payload.phoneNumber,
        dateOfBirth: payload.dateOfBirth,
        BVN: payload.BVN,
      },
      nextId: payload.nextId,
    };

    const res = await apiFetch<LoanUpdateApiResponse>(
      "/v1/loan/request/update",
      {
        method: "POST",
        isProtected: true,
        body,
      },
    );

    return ok({
      nextId: res.response.responseData.nextId,
    });
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------------------
// Step 3 — Submit employment details
// POST /v1/loan/request/update  (nextId prefix: EMP-)
// ---------------------------------------------------------------------------

export interface SubmitEmploymentDetailsPayload {
  monthlyIncome: number;
  employmentStatus: string; // e.g. "employed", "self-employed"
  nextId: string; // returned from Step 2
}

export async function submitLoanEmploymentDetails(
  payload: SubmitEmploymentDetailsPayload,
): Promise<ActionResult<LoanUpdateResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const body = {
      request: {
        monthlyIncome: payload.monthlyIncome,
        employmentStatus: payload.employmentStatus,
      },
      nextId: payload.nextId,
    };

    const res = await apiFetch<LoanUpdateApiResponse>(
      "/v1/loan/request/update",
      {
        method: "POST",
        isProtected: true,
        body,
      },
    );

    return ok({
      nextId: res.response.responseData.nextId,
    });
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------------------
// Step 4 — Submit guarantor details
// POST /v1/loan/request/update  (nextId prefix: IGU-)
// ---------------------------------------------------------------------------

export interface SubmitGuarantorDetailsPayload {
  name: string;
  phoneNumber: string;
  nextId: string; // returned from Step 3
}

export async function submitLoanGuarantorDetails(
  payload: SubmitGuarantorDetailsPayload,
): Promise<ActionResult<LoanUpdateResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const body = {
      request: {
        name: payload.name,
        phoneNumber: payload.phoneNumber,
      },
      nextId: payload.nextId,
    };

    const res = await apiFetch<LoanUpdateApiResponse>(
      "/v1/loan/request/update",
      {
        method: "POST",
        isProtected: true,
        body,
      },
    );

    return ok({
      nextId: res.response.responseData.nextId,
    });
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------------------
// Asset Finance — Submit asset type details
// POST /v1/loan/request/update
// ---------------------------------------------------------------------------

export interface SubmitAssetDetailsPayload {
  assetName: string;
  assetAmount: number;
  nextId: string;
}

export async function submitLoanAssetDetails(
  payload: SubmitAssetDetailsPayload,
): Promise<ActionResult<LoanUpdateResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const body = {
      request: {
        assetName: payload.assetName,
        assetAmount: payload.assetAmount,
      },
      nextId: payload.nextId,
    };

    const res = await apiFetch<LoanUpdateApiResponse>(
      "/v1/loan/request/update",
      {
        method: "POST",
        isProtected: true,
        body,
      },
    );

    return ok({
      nextId: res.response.responseData.nextId,
    });
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------------------
// Asset Finance — Submit document URLs
// POST /v1/loan/request/update
// Body field names per backend's DocumentAssetDTO (identityProof, bankStatement, invoice)
// ---------------------------------------------------------------------------

export interface SubmitAssetFinanceDocumentsPayload {
  identityProof: string;
  bankStatement: string;
  invoice: string;
  nextId: string;
}

export async function submitAssetFinanceDocuments(
  payload: SubmitAssetFinanceDocumentsPayload,
): Promise<ActionResult<LoanUpdateResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const body = {
      request: {
        identityProof: payload.identityProof,
        bankStatement: payload.bankStatement,
        invoice: payload.invoice,
      },
      nextId: payload.nextId,
    };

    const res = await apiFetch<LoanUpdateApiResponse>(
      "/v1/loan/request/update",
      {
        method: "POST",
        isProtected: true,
        body,
      },
    );

    return ok({
      nextId: res.response.responseData.nextId,
    });
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------------------
// Local Purchase Order — Submit company information
// POST /v1/loan/request/update
// ---------------------------------------------------------------------------

export interface SubmitCompanyDetailsPayload {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  cacNumber: string;
  nextId: string;
}

export async function submitLoanCompanyDetails(
  payload: SubmitCompanyDetailsPayload,
): Promise<ActionResult<LoanUpdateResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const body = {
      request: {
        businessName: payload.businessName,
        businessEmail: payload.businessEmail,
        businessPhone: payload.businessPhone,
        cacNumber: payload.cacNumber,
      },
      nextId: payload.nextId,
    };

    const res = await apiFetch<LoanUpdateApiResponse>(
      "/v1/loan/request/update",
      {
        method: "POST",
        isProtected: true,
        body,
      },
    );

    return ok({
      nextId: res.response.responseData.nextId,
    });
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------------------
// Step 5 — Customer consent (after admin approval)
// POST /v1/loan/request/consent/:loanId
// ---------------------------------------------------------------------------

export interface SubmitLoanConsentPayload {
  loanId: number | string;
  consent: boolean;
}

export async function submitLoanConsent(
  payload: SubmitLoanConsentPayload,
): Promise<ActionResult<LoanConsentResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const body = {
      consent: payload.consent,
    };

    const res = await apiFetch<LoanConsentApiResponse>(
      `/v1/loan/request/consent/${payload.loanId}`,
      {
        method: "POST",
        isProtected: true,
        body,
      },
    );

    revalidatePath("/dashboard/loans");

    return ok({
      success: res.responseCode === "00",
      message: res.responseMessage,
    });
  } catch (e) {
    return fail(e);
  }
}

export async function getPendingLoan(): Promise<
  ActionResult<PendingLoanResponse>
> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("User not authenticated and no walletId provided");
    }

    const walletId = session!.user.walletAccount;

    const url = `/v1/user/loan/pending?walletId=${walletId}`;

    const res = await apiFetch<PendingLoanApiResponse>(url, {
      method: "GET",
      isProtected: true,
    });

    const code = String(res?.responseCode ?? "");

    if (code === "00") {
      return ok({ pending: true, data: res.data, loan: res.loan });
    }

    // no pending or other non-success response
    return ok({
      pending: false,
      message: res.responseMessage || "no pending loan request",
    });
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------------------
// GET /v1/user/loan/request/pending?walletId={walletId}
// Distinct from /v1/user/loan/pending above — this lists a wallet's pending
// loan *requests* (applications in progress), confirmed live by backend.
// Response shape is not yet confirmed to have per-item examples, so item
// fields are inferred from the sibling /v1/user/loan/pending shape.
// ---------------------------------------------------------------------------

type PendingLoanRequestsApiResponse = {
  responseCode: string | number;
  responseMessage?: string;
  data?: PendingLoanData | PendingLoanData[] | null;
};

export type PendingLoanRequestsResponse = {
  requests: PendingLoanData[];
};

export async function getPendingLoanRequests(): Promise<
  ActionResult<PendingLoanRequestsResponse>
> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("User not authenticated and no walletId provided");
    }

    const walletId = session.user.walletAccount;

    const res = await apiFetch<PendingLoanRequestsApiResponse>(
      `/v1/user/loan/request/pending?walletId=${walletId}`,
      {
        method: "GET",
        isProtected: true,
      },
    );

    const code = String(res?.responseCode ?? "");

    if (code !== "00" || !res.data) {
      return ok({ requests: [] });
    }

    const requests = Array.isArray(res.data) ? res.data : [res.data];

    return ok({ requests });
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------------------
// GET /v1/loan/fetch-loan-product
// Lists active loan products. Each product carries fixed terms (interest
// rate, fees, tenor) — Tenor is a single upper-limit value per product, not
// a selectable range.
// ---------------------------------------------------------------------------

export type LoanProduct = {
  productName: string;
  productCode: string;
  description: string;
  interestRate: number;
  managementFee: number;
  adminFee: number;
  insurance: number;
  tenor: number;
};

type LoanProductApiResponse = {
  responseCode: string | number;
  responseMessage?: string;
  data?: Array<{
    ProductName: string;
    ProductCode: string;
    Description: string;
    InterestRate: string;
    ManagementFee: string;
    AdminFee: string;
    Insurance: string;
    Tenor: string;
  }>;
};

export type LoanProductsResponse = {
  products: LoanProduct[];
};

export async function getLoanProducts(): Promise<
  ActionResult<LoanProductsResponse>
> {
  try {
    const res = await apiFetch<LoanProductApiResponse>(
      "/v1/loan/fetch-loan-product",
      {
        method: "GET",
        isProtected: true,
      },
    );

    const code = String(res?.responseCode ?? "");

    if (code !== "00" || !res.data) {
      return ok({ products: [] });
    }

    const products = res.data.map((p) => ({
      productName: p.ProductName,
      productCode: p.ProductCode,
      description: p.Description,
      interestRate: Number(p.InterestRate),
      managementFee: Number(p.ManagementFee),
      adminFee: Number(p.AdminFee),
      insurance: Number(p.Insurance),
      tenor: Number(p.Tenor),
    }));

    return ok({ products });
  } catch (e) {
    return fail(e);
  }
}
