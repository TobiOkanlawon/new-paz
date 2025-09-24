import PrivateGuard from "./AuthGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateGuard>{children}</PrivateGuard>;
}
