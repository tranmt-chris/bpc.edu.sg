import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buddhist & Pali College of Singapore",
  description:
    "Buddhist and Pali College Singapore, Certificate Buddhist Counselling, Introduction Buddhism, Bachelor, Master of Arts, Doctor of Philosophy, Buddhist Studies",
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" },
  metadataBase: new URL("https://bpc-college-preview-2026.chris-tranmt.chatgpt.site"),
  openGraph: { title: "Buddhist & Pali College of Singapore", description: "Buddhist education for everyone since 1993.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
