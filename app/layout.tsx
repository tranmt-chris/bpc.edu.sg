import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buddhist and Pali College of Singapore | Home",
  description:
    "Buddhist and Pali College Singapore, Certificate Buddhist Counselling, Introduction Buddhism, Bachelor, Master of Arts, Doctor of Philosophy, Buddhist Studies",
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
