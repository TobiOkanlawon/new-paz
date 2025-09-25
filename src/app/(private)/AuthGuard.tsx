"use client";
export default function PrivateGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  // const token = useRecoilValue(authTokenState);
  // const router = useRouter();

  // useEffect(() => {
  //   if (!token) {
  //     router.push("/login");
  //   }
  // }, [token, router]);

  // if (!token) return null;

  return <>{children}</>;
}
