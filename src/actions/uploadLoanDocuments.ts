"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { uploadLoanDocument } from "@/libs/cloudflare";
import { fail, ok, type ActionResult } from "@/actions/shared";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export type UploadLoanDocumentResponse = {
  documentUrl: string;
};

export async function uploadLoanDocumentAction(
  formData: FormData,
): Promise<ActionResult<UploadLoanDocumentResponse>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      throw new Error("User not authenticated");
    }

    const file = formData.get("file") as File | null;
    const loanType = formData.get("loanType") as string | null;
    const nextId = formData.get("nextId") as string | null;
    const fieldName = formData.get("fieldName") as string | null;

    if (!file) {
      throw new Error("No file provided");
    }

    if (!loanType) {
      throw new Error("Loan type is required");
    }

    if (!nextId) {
      throw new Error("Next ID is required");
    }

    if (!fieldName) {
      throw new Error("Field name is required");
    }

    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      throw new Error(`${fieldName} must be a PDF, JPG, or PNG file`);
    }

    if (file.size > MAX_DOCUMENT_SIZE) {
      throw new Error(`${fieldName} must be 5MB or smaller`);
    }

    const documentUrl = await uploadLoanDocument(file, { loanType, nextId, fieldName });

    return ok({ documentUrl });
  } catch (error) {
    return fail(error);
  }
}
