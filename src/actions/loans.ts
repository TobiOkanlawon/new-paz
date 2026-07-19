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
// Success response example:
// {
//   "data": { ... },
//   "responseCode": "00",
//   "responseMessage": "loan request successfully retrieved"
// }
// No-pending response example:
// {
//   "responseCode": 400,
//   "responseMessage": "no pending loan request found"
// }

type PendingLoanData = {
  Amount: number;
  Approved: boolean;
  ApprovedAmount: number;
  Consent: boolean;
  Purpose: string;
  Tenor: string;
  OtherInfo: string; // e.g. nextId like IPE-6977222064
};

type PendingLoanApiResponse = {
  responseCode: string | number;
  responseMessage?: string;
  data?: PendingLoanData;
};

export type PendingLoanResponse = {
  pending: boolean;
  data?: PendingLoanData;
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

    const walletId = session.user.walletAccount;

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
      return ok({ pending: true, data: res.data });
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
