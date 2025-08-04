import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/sidebar";
import { initialCrops } from "@/lib/data";

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
        <div className="flex min-h-screen">
          <Sidebar crops={initialCrops} />
          <main className="flex-1 md:p-4 p-2 overflow-y-auto bg-muted/40">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
