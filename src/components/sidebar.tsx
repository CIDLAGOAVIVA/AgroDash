"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Home,
  Leaf,
  Menu,
  PanelLeft,
  Settings,
  Wheat,
  MapPin,
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
import type { Crop, Property } from "@/types";
import { useTransition } from "@/hooks/use-transition";
import { useRouter } from "next/navigation";
import type { DashboardCrop } from "@/types";


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
  crops: DashboardCrop[];
  properties: Property[];
}

function SidebarDesktop({ properties }: { properties: Property[] }) {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();
  const { startTransition } = useTransition();
  const router = useRouter();

  const handlePropertyClick = (propertyId: string, href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(propertyId);

    setTimeout(() => {
      router.push(href);
    }, 300);
  };

  return (
    <aside
      className={cn(
        "relative hidden h-screen shrink-0 border-r border-border/50 bg-background transition-all duration-200 ease-in-out md:flex md:flex-col",
        isOpen ? "w-52" : "w-14" // Reduced width when expanded
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-center border-b border-border/50 px-3">
        <Link href="/" className="flex items-center gap-1.5 font-semibold">
          <Leaf className="h-5 w-5 text-primary" />
          <span className={cn("transition-all text-primary font-bold text-sm", !isOpen && "opacity-0 w-0")}>
            AgriDash
          </span>
        </Link>
      </div>

      <nav className="flex-grow space-y-1 overflow-auto px-2 py-3">
        <TooltipProvider delayDuration={300}>
          <ul className="space-y-1">
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-all hover:bg-accent/50",
                      pathname === "/"
                        ? "bg-accent/70 text-accent-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    <Home className="h-4 w-4" />
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
                  <TooltipContent side="right" className="text-xs">Visão Geral</TooltipContent>
                )}
              </Tooltip>
            </li>

            {/* Listar Propriedades */}
            {properties.map((property) => {
              const href = `/property/${property.id}`;
              return (
                <li key={property.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-all hover:bg-accent/50",
                          pathname.startsWith(href)
                            ? "bg-accent/70 text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                        onClick={handlePropertyClick(property.id, href)}
                      >
                        <MapPin className="h-4 w-4" />
                        <span
                          className={cn(
                            "overflow-hidden transition-all truncate",
                            isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                          )}
                        >
                          {property.name}
                        </span>
                      </Link>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side="right" className="text-xs">
                        {property.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}

            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground",
                      pathname === "/admin" && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Settings className="h-5 w-5" />
                    <span
                      className={cn(
                        "overflow-hidden transition-all",
                        isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                      )}
                    >
                      Administração
                    </span>
                  </Link>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right">Administração</TooltipContent>
                )}
              </Tooltip>
            </li>
          </ul>
        </TooltipProvider>
      </nav>

      <div className="mt-auto border-t border-border/50 p-2">
        <Button
          onClick={toggle}
          variant="ghost"
          size="sm"
          className="w-full justify-center h-8"
        >
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
    </aside>
  );
}

function SidebarMobile({ crops = [] }: { crops: DashboardCrop[] }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { startTransition } = useTransition();
  const router = useRouter();

  const handleCropClick = (cropId: string, href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    startTransition(cropId);

    setTimeout(() => {
      router.push(href);
    }, 300);
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-background px-3 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col w-64 p-4">
          <SheetHeader className="sr-only">

            <SheetTitle>Navegação Principal</SheetTitle>
          </SheetHeader>
          <nav className="grid gap-1 text-sm font-medium">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-primary font-semibold mb-4"
              onClick={() => setOpen(false)}
            >
              <Leaf className="h-5 w-5" />
              <span>AgriDash</span>
            </Link>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-1.5",
                pathname === "/"
                  ? "bg-accent/70 text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Home className="h-4 w-4" />
              Visão Geral
            </Link>
            {crops.map((crop) => {
              const Icon = cropIcons[crop.cropType] || Leaf;
              const href = `/dashboard/${crop.id}`;
              return (
                <Link
                  key={crop.id}
                  href={href}
                  onClick={handleCropClick(crop.id, href)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-1.5",
                    pathname === href
                      ? "bg-accent/70 text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {crop.fieldName}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <Link href="/" className="flex items-center gap-1.5">
        <Leaf className="h-5 w-5 text-primary" />
        <span className="font-semibold text-primary">AgriDash</span>
      </Link>

      <div className="flex items-center gap-2">
        {/* You can add additional header controls here if needed */}
      </div>
    </header>
  );
}

export function Sidebar({ crops = [], properties = [] }: SidebarProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className={cn(!isClient && "hidden")}>
      <SidebarDesktop properties={properties} />
      <SidebarMobile crops={crops} />
    </div>
  );
}
