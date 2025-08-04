import Image from "next/image";
import styles from "./layout.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Image
          src={"/PAZLogo.png"}
          alt="Logo"
          width={127}
          height={42.61}
          className={styles.logo}
        />
        <div className={styles.leftContainer}>
          <Image
            src={"/lightbulb.png"}
            alt="light bulb"
            width={52.5}
            height={52.5}
            className={styles.lightbulb}
          />
          <p>Bank the PAZ way!</p>
          <h1>Tips on becoming financially stable all year round!</h1>
        </div>
        <div className={styles.spacer}></div>
        <Image
          src={"/Arrow.png"}
          alt="Arrow"
          width={151}
          height={212}
          className={styles.arrow}
        />
        <Image
          src={"/Money.png"}
          alt="Money"
          width={110}
          height={152}
          className={styles.money}
        />
        <Image
          src={"/Coin.png"}
          alt="Coin"
          width={142}
          height={157}
          className={styles.coin}
        />
        <Image
          src={"/target.png"}
          alt="Target"
          width={110}
          height={140}
          className={styles.target}
        />
      </div>
      {children}
    </div>
  );
}
