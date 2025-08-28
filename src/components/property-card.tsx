"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Leaf, Wheat, MapPin, Home, Building, Landmark, Warehouse, Factory } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardCrop } from "@/types";
import { useTransition } from "@/hooks/use-transition";

// Soybean custom icon
const Soybean = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 9c-.97.68-1.65 1.79-2 3 .35 1.21 1.03 2.32 2 3 .97-.68 1.65-1.79 2-3-.35-1.21-1.03-2.32-2-3z" />
        <path d="M15 9c-.97.68-1.65 1.79-2 3 .35 1.21 1.03 2.32 2 3 .97-.68 1.65-1.79 2-3-.35-1.21-1.03-2.32-2-3z" />
        <path d="M12 4c-.97.68-1.65 1.79-2 3 .35 1.21 1.03 2.32 2 3 .97-.68 1.65-1.79 2-3-.35-1.21-1.03-2.32-2-3z" />
        <path d="M12 14c-.97.68-1.65 1.79-2 3 .35 1.21 1.03 2.32 2 3 .97-.68 1.65-1.79 2-3-.35-1.21-1.03-2.32-2-3z" />
    </svg>
);

// Corn custom icon
const Corn = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v16" />
        <path d="M6 12c1 3 3 4 6 4s5-1 6-4c1-4-2-8-6-8s-7 4-6 8z" />
        <path d="M6 12c0 0 2 3 6 3s6-3 6-3" />
    </svg>
);

// Sprout icon - existing in your file
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

// Mapeamento de ícones para tipos de cultura - atualizado para usar os ícones personalizados
const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    "Soja": Soybean,
    "Milho": Corn,
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
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    {propertyName}
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