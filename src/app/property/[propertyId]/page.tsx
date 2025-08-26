"use client";

import { useState, use, useEffect } from "react";
import { notFound } from "next/navigation";
import { initialProperties } from "@/lib/data";
import { useTransition } from "@/hooks/use-transition";
import { DashboardClient } from "@/components/dashboard-client";
import { PropertyCard } from "@/components/property-card";
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
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Novo card de propriedade */}
            <PropertyCard
                propertyName={property.name}
                crops={property.crops}
                selectedCropId={selectedCrop.id}
                onCropChange={handleCropChange}
            />

            {/* Painel da cultura selecionada */}
            <DashboardClient initialCrop={selectedCrop} allCrops={property.crops} />
        </div>
    );
}