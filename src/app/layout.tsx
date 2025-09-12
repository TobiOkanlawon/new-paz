import "./globals.css";
import { Poppins, Montserrat, Inter } from "next/font/google";
import Providers from "@/components/globals/providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "PAZ",
  description: "Powering Dreams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
=======
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} ${inter.variable}`}
    >
>>>>>>> chore/refactor
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
