import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Lejja - The Future of Accounting is Human + AI",
  description:
    "API-first infrastructure for modern finance teams to automate reconciliation and maintain control.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${spaceGrotesk.variable} font-[family-name:var(--font-space-grotesk)]`}
    >
      {children}
    </div>
  );
}
