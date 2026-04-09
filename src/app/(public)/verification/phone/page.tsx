import { Loading } from "@/components/Loading";
import { Suspense } from "react";
import PhoneVerification from "./PhoneVerification";

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <PhoneVerification />
    </Suspense>
  );
};

export default Page;
