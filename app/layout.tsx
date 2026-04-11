import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://music-decision-site.vercel.app"),
  title: {
    default: "Decision Systems for Modern Music Teams",
    template: "%s — Decision System",
  },
  description:
    "AI-powered decision tools for modern music marketing. Turn streaming and campaign data into decisions — not dashboards.",
  openGraph: {
    title: "Decision Systems for Modern Music Teams",
    description:
      "Three tools, one workflow. Turn streaming and campaign data into clear next moves — not dashboards.",
    type: "website",
    siteName: "Decision System",
    url: "https://music-decision-site.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Decision Systems for Modern Music Teams",
    description:
      "Three tools, one workflow. Turn streaming and campaign data into clear next moves — not dashboards.",
  },
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
