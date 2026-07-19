"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getProfile } from "@/actions/profile";
import { formatBirthdayToDateInputFormat } from "@/libs/helpers";

export type PersonalInfoPrefill = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
};

// BVN is intentionally excluded: the raw number is never persisted anywhere
// after verification (only the isBvnVerified boolean survives), so it can't
// be pre-filled — it stays a required, user-entered field.
export function usePersonalInfoPrefill(isOpen: boolean): PersonalInfoPrefill | null {
  const { data: session } = useSession();
  const [prefill, setPrefill] = useState<PersonalInfoPrefill | null>(null);

  const firstName = session?.user?.firstName;
  const lastName = session?.user?.lastName;
  const sessionEmail = session?.user?.email;

  useEffect(() => {
    if (!isOpen) {
      setPrefill(null);
      return;
    }

    let cancelled = false;

    (async () => {
      const fullName = [firstName, lastName].filter(Boolean).join(" ");
      const result = await getProfile();

      if (cancelled) return;

      setPrefill({
        fullName,
        email: (result.success ? result.data.email : sessionEmail) ?? "",
        phone: result.success ? result.data.phoneNumber ?? "" : "",
        dob: result.success ? formatBirthdayToDateInputFormat(result.data.birthday) : "",
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, firstName, lastName, sessionEmail]);

  return prefill;
}
