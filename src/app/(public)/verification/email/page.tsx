import { Loading } from "@/components/Loading";
import { Suspense } from "react";
import EmailVerification from "./EmailVerification";

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <EmailVerification />
    </Suspense>
  );
};

export default Page;
