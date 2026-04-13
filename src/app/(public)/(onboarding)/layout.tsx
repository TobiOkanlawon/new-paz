import styles from "./layout.module.css";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
