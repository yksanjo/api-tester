import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "API Tester - Test APIs Instantly",
  description: "A powerful API testing tool with request builder, response viewer, and history",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
