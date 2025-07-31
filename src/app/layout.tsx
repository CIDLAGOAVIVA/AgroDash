import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/hooks/use-sidebar";
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
        <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar crops={initialCrops} />
              <main className="flex-1 md:p-8 p-4 overflow-y-auto">
                {children}
              </main>
            </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
