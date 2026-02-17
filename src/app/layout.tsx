import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchBridge - Where Startups Meet Investors",
  description:
    "AI-powered matchmaking platform connecting startups with aligned investors.",
  keywords: [
    "startup",
    "investor",
    "funding",
    "matchmaking",
    "venture capital",
    "fundraising",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            },
          }}
        />
      </body>
    </html>
  );
}
