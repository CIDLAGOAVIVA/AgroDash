"use client";

import { useState, use, useEffect } from "react";
import { notFound } from "next/navigation";
import { initialProperties } from "@/lib/data";
import { useTransition } from "@/hooks/use-transition";
import { CropCard } from "@/components/crop-card";
import { DashboardClient } from "@/components/dashboard-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { DashboardCrop } from "@/types";

export default function PropertyPage({ params }: { params: { propertyId: string } | Promise<{ propertyId: string }> }) {
    // Resolver parâmetros
    const resolvedParams = typeof params === 'object' && !('then' in params)
        ? params
        : use(params as Promise<{ propertyId: string }>);

    const property = initialProperties.find((p) => p.id === resolvedParams.propertyId);
    const { isInitialLoad } = useTransition();
    const [isReady, setIsReady] = useState(!isInitialLoad);
    const [selectedCrop, setSelectedCrop] = useState<DashboardCrop | null>(property?.crops[0] || null);

    useEffect(() => {
        if (!isInitialLoad) {
            setIsReady(true);
        }
    }, [isInitialLoad]);

    if (!property) {
        notFound();
    }

    // Não renderiza nada durante a transição inicial
    if (!isReady || !selectedCrop) {
        return null;
    }

    const handleCropChange = (cropId: string) => {
        const newCrop = property.crops.find(c => c.id === cropId);
        if (newCrop) {
            setSelectedCrop(newCrop);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <Card className="bg-background">
                <CardHeader className="py-4">
                    <CardTitle>{property.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 pt-0">
                    {property.crops.map(crop => (
                        <div
                            key={crop.id}
                            className={`cursor-pointer transition-all ${selectedCrop?.id === crop.id ? 'scale-105' : 'opacity-80 hover:opacity-100'}`}
                            onClick={() => handleCropChange(crop.id)}
                        >
                            <CropCard crop={crop} onCropChange={() => handleCropChange(crop.id)} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <DashboardClient initialCrop={selectedCrop} allCrops={property.crops} />
        </div>
    );
}