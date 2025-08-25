import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/sidebar";
import { initialCrops } from "@/lib/data";
import { TransitionProvider } from "@/hooks/use-transition";
import { TransitionOverlay } from "@/components/transition-overlay";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AgriDash",
  description: "Painel de monitoramento agrícola em tempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <TransitionProvider>
          <div className="flex flex-col md:flex-row min-h-screen bg-background">
            <Sidebar crops={initialCrops} />
            <main className="flex-1 md:p-4 p-2 overflow-y-auto">
              {children}
            </main>
          </div>
          <TransitionOverlay />
          <Toaster />
        </TransitionProvider>
      </body>
    </html>
  );
}
