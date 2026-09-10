import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Günəş Enerjisi üzrə Bələdçi",
    template: "%s · Enerji Bələdçisi",
  },
  description:
    "Günəş enerjisini anlamaq, ölçmək və düzgün qərar vermək üçün Azərbaycan dilində praktik bələdçi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
