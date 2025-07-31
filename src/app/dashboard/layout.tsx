import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { initialCrops } from "@/lib/data";
import { Home, Leaf, PanelLeft, Wheat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Sprout = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sprout"><path d="M7 20h10"/><path d="M12 20V4"/><path d="M12 4c0-2.21-1.79-4-4-4S4 1.79 4 4c0 .62.14 1.2.38 1.72"/><path d="M12 4c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .62-.14 1.2-.38 1.72"/></svg>
)

const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Soja": Leaf,
  "Milho": Sprout,
  "Trigo": Wheat,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <SidebarHeader>
            <Button asChild variant="ghost" className="w-full justify-start gap-2">
                <Link href="/">
                    <h2 className="text-lg font-semibold tracking-tight">AgriDash</h2>
                </Link>
            </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/">
                        <Home/>
                        <span>Visão Geral</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            
            {initialCrops.map((crop) => {
              const Icon = cropIcons[crop.cropType] || Leaf;
              return (
                <SidebarMenuItem key={crop.id}>
                    <SidebarMenuButton asChild>
                        <Link href={`/dashboard/${crop.id}`}>
                            <Icon />
                            <span>{crop.fieldName}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1">
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <SidebarTrigger className="md:hidden"/>
            </div>
            {children}
        </div>
      </main>
    </div>
  );
}
