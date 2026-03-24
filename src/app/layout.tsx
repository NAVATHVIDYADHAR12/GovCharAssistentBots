import type { Metadata } from "next";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "GovCharAssistentBots",
  description:
    "Unified AI assistant for Indian government services, scholarships, legal rights, career guidance, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0a0a1a] text-white antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
