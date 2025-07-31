import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { Poppins, Montserrat, Inter } from "next/font/google";

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

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
        <body>{children}</body>
      </html>
    </QueryClientProvider>
  );
}
