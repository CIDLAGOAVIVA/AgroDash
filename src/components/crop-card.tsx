"use client";

import { Leaf, Wheat, ChevronDown } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Crop } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "@/hooks/use-transition";
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
  "Soja": Leaf,
  "Milho": Sprout,
  "Trigo": Wheat,
  // Adicione outros tipos se necessário
};

interface CropCardProps {

  crop: Crop;
  allCrops?: Crop[];
  onCropChange?: (cropId: string) => void;

  crop: DashboardCrop;
}

export function CropCard({ crop, allCrops = [], onCropChange }: CropCardProps) {
  const CropIcon = cropIcons[crop.cropType] || Leaf;
  const router = useRouter();
  const { startTransition } = useTransition();

  const handleCropSelect = (cropId: string) => {
    // Always start the transition animation regardless of which behavior follows
    startTransition(cropId);

    if (onCropChange) {
      // If we have a custom change handler, call it after a brief delay
      // to allow the transition animation to begin
      setTimeout(() => {
        onCropChange(cropId);
      }, 300);
    } else {
      // Default behavior if no onCropChange handler is provided
      setTimeout(() => {
        router.push(`/dashboard/${cropId}`);
      }, 300);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-md border border-primary/20">
              <CropIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{crop.cropType}</CardTitle>
              <CardDescription className="text-sm">{crop.fieldName}</CardDescription>
            </div>
          </div>

          {allCrops.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 p-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent/50 transition-colors">
                Trocar Cultura <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {allCrops.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    className="flex items-center gap-2"
                    onClick={() => handleCropSelect(c.id)}
                    disabled={c.id === crop.id}
                  >
                    {(() => {
                      const Icon = cropIcons[c.cropType] || Leaf;
                      return <Icon className="h-4 w-4 text-primary" />;
                    })()}
                    <span>{c.fieldName}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
