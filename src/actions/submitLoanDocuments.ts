"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { fail, ok, type ActionResult } from "@/actions/shared";

type LoanDocumentsApiResponse = {
  response?: {
    responseCode?: string;
    responseMessage?: string;
    responseData?: {
      nextId?: string;
    };
  };
};

export type SubmitLoanDocumentsResponse = {
  nextId: string;
};

export type SubmitLoanDocumentsPayload = {
  nextId: string;
  loanType: string;
  documents: Array<{
    fieldName: string;
    file: File;
  }>;
};

const API_BASE_URL = process.env.API_BASE_URL ?? "";

export async function submitLoanDocumentsAction(
  payload: SubmitLoanDocumentsPayload,
): Promise<ActionResult<SubmitLoanDocumentsResponse>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      throw new Error("User not authenticated");
    }

    if (!payload.nextId) {
      throw new Error("Next ID is required");
    }

    if (!payload.loanType) {
      throw new Error("Loan type is required");
    }

    if (!payload.documents.length) {
      throw new Error("At least one document is required");
    }

    const formData = new FormData();
    formData.append("nextId", payload.nextId);
    formData.append("loanType", payload.loanType);

    for (const document of payload.documents) {
      formData.append(document.fieldName, document.file, document.file.name);
    }

    const response = await fetch(`${API_BASE_URL}/v1/loan/request/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: formData,
      cache: "no-store",
    });

    const body = (await response.json()) as LoanDocumentsApiResponse;
    const code = body.response?.responseCode;
    const message = body.response?.responseMessage;
    const nextId = body.response?.responseData?.nextId;

    if (code !== "00") {
      return fail({
        success: false,
        error: new Error(message || "Failed to submit loan documents"),
      });
    }

    return ok({ nextId: nextId ?? payload.nextId });
  } catch (error) {
    return fail({ success: false, error });
  }
}
