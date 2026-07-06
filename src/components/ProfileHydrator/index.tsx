"use client";

import { useEffect } from "react";
import { getProfile } from "@/actions/profile";
import useUser from "@/store/userStore";

const DEFAULT_IMAGE = "/profile.png";

export default function ProfileHydrator() {
  const setProfileImage = useUser((state) => state.setProfileImage);

  useEffect(() => {
    const run = () => {
      const { profileImage } = useUser.getState();
      if (profileImage !== DEFAULT_IMAGE) return;

      getProfile().then((res) => {
        if (res.success && res.data?.profileImage) {
          setProfileImage(res.data.profileImage);
        }
      });
    };

    if (useUser.persist.hasHydrated()) {
      run();
    } else {
      const unsub = useUser.persist.onFinishHydration(run);
      return unsub;
    }
  }, []);

  return null;
}
