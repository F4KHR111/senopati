import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SENOPATI",
    template: "%s — SENOPATI",
  },
  description:
    "System Enterprise Nasional Operasional Pengelolaan Aset Terintegrasi — Sekretariat Negara Republik Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-bg text-text-primary font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
