
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Home,
  Leaf,
  Menu,
  PanelLeft,
  Wheat,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import type { Crop } from "@/types";

const Sprout = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-sprout"
  >
    <path d="M7 20h10" />
    <path d="M12 20V4" />
    <path d="M12 4c0-2.21-1.79-4-4-4S4 1.79 4 4c0 .62.14 1.2.38 1.72" />
    <path d="M12 4c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .62-.14 1.2-.38 1.72" />
  </svg>
);

const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Soja: Leaf,
  Milho: Sprout,
  Trigo: Wheat,
};

interface SidebarProps {
  crops: Crop[];
}

function SidebarDesktop({ crops }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "relative hidden h-screen shrink-0 border-r bg-background transition-[width] duration-300 md:flex md:flex-col",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Leaf className="h-6 w-6 text-primary" />
          <span className={cn("transition-opacity text-primary font-bold", !isOpen && "opacity-0 w-0")}>
            AgriDash
          </span>
        </Link>
      </div>

      <nav className="flex-grow space-y-2 overflow-auto px-4 py-4">
        <TooltipProvider>
          <ul className="space-y-2">
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground",
                      pathname === "/" && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Home className="h-5 w-5" />
                    <span
                      className={cn(
                        "overflow-hidden transition-all",
                        isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                      )}
                    >
                      Visão Geral
                    </span>
                  </Link>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right">Visão Geral</TooltipContent>
                )}
              </Tooltip>
            </li>
            {crops.map((crop) => {
              const Icon = cropIcons[crop.cropType] || Leaf;
              const href = `/dashboard/${crop.id}`;
              return (
                <li key={crop.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground",
                          pathname === href && "bg-accent text-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span
                          className={cn(
                            "overflow-hidden transition-all",
                            isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                          )}
                        >
                          {crop.fieldName}
                        </span>
                      </Link>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side="right">
                        {crop.fieldName}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>

      <div className="mt-auto border-t p-4">
        <Button
          onClick={toggle}
          variant="ghost"
          className="w-full justify-center"
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
    </aside>
  );
}

function SidebarMobile({ crops }: SidebarProps) {
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);

    return (
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
          <SheetHeader className="sr-only">
              <SheetTitle>Navegação Principal</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold mb-4"
                onClick={() => setOpen(false)}
              >
                <span>AgriDash</span>
              </Link>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", pathname === "/" && "bg-muted text-foreground")}
              >

                <Home className="h-5 w-5" />
                Visão Geral
              </Link>
               {crops.map((crop) => {
                const Icon = cropIcons[crop.cropType] || Leaf;
                const href = `/dashboard/${crop.id}`;
                return (
                    <Link
                    key={crop.id}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", pathname === href && "bg-muted text-foreground")}
                  >
                    <Icon className="h-5 w-5" />
                    {crop.fieldName}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
    );
  }

export function Sidebar({ crops }: SidebarProps) {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null;
  }
  
  return (
    <>
      <SidebarDesktop crops={crops} />
      <SidebarMobile crops={crops} />
    </>
  );
}
