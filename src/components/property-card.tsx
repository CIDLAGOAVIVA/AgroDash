"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Leaf, Wheat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardCrop } from "@/types";
import { useTransition } from "@/hooks/use-transition";

// Importando o ícone Sprout do seu código existente
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

// Mapeamento de ícones para tipos de cultura
const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    "Soja": Leaf,
    "Milho": Sprout,
    "Trigo": Wheat,
};

interface PropertyCardProps {
    propertyName: string;
    crops: DashboardCrop[];
    selectedCropId: string;
    onCropChange: (cropId: string) => void;
}

export function PropertyCard({
    propertyName,
    crops,
    selectedCropId,
    onCropChange
}: PropertyCardProps) {
    const { startTransition } = useTransition();

    const handleCropSelect = (cropId: string) => {
        startTransition(cropId);

        // Pequeno delay para a animação começar
        setTimeout(() => {
            onCropChange(cropId);
        }, 300);
    };

    return (
        <Card className="bg-background w-full shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                    <span className="text-primary mr-2">📍</span> {propertyName}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-3">
                    {crops.map((crop) => {
                        const Icon = cropIcons[crop.cropType] || Leaf;
                        const isSelected = crop.id === selectedCropId;

                        return (
                            <div
                                key={crop.id}
                                onClick={() => handleCropSelect(crop.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300",
                                    "border-2 hover:border-primary/60 hover:bg-primary/5",
                                    isSelected
                                        ? "border-primary bg-primary/10 shadow-md"
                                        : "border-border"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-full mb-2",
                                    isSelected ? "bg-primary/20" : "bg-muted"
                                )}>
                                    <Icon className={cn(
                                        "h-6 w-6",
                                        isSelected ? "text-primary" : "text-muted-foreground"
                                    )} />
                                </div>
                                <h3 className={cn(
                                    "font-medium text-center",
                                    isSelected ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {crop.cropType}
                                </h3>
                                <p className="text-xs text-center text-muted-foreground mt-1">
                                    {crop.fieldName}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}