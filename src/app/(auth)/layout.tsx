import styles from "./layout.module.css";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <aside>{children}</aside>
    </div>
  );
}
