import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decision Systems for Modern Music Teams",
  description:
    "AI-powered decision tools for modern music marketing. Turn streaming and campaign data into decisions — not dashboards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative font-sans antialiased">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
