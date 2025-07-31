"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Crop } from "@/types";
import { cn } from "@/lib/utils";

const severityColors = {
    Normal: "bg-green-500",
    Atenção: "bg-yellow-500",
    Crítico: "bg-red-500",
}

type FieldMapProps = {
    crops: Crop[];
    activeCropId?: string;
    onMarkerClick: (id: string) => void;
};

export function FieldMap({ crops, activeCropId, onMarkerClick }: FieldMapProps) {
    // This is a simplified map representation using divs.
    // For a real-world scenario, you would integrate a mapping library like Leaflet or Google Maps.

    const minLat = Math.min(...crops.map(c => c.location.lat));
    const maxLat = Math.max(...crops.map(c => c.location.lat));
    const minLng = Math.min(...crops.map(c => c.location.lng));
    const maxLng = Math.max(...crops.map(c => c.location.lng));
    
    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    const getPosition = (lat: number, lng: number) => {
        const top = latRange > 0 ? ((maxLat - lat) / latRange) * 100 : 50;
        const left = lngRange > 0 ? ((lng - minLng) / lngRange) * 100 : 50;
        return { top: `${top}%`, left: `${left}%` };
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Mapa dos Talhões</CardTitle>
                <CardDescription>Visão geral da localização e status das culturas.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative w-full h-96 bg-muted/50 rounded-lg overflow-hidden border">
                    {/* Placeholder for map background, e.g., an image of a satellite map */}
                    <img 
                      src="https://placehold.co/600x400.png"
                      alt="Mapa da fazenda"
                      data-ai-hint="farm satellite map"
                      className="w-full h-full object-cover opacity-30"
                    />

                    {crops.map(crop => {
                        const { top, left } = getPosition(crop.location.lat, crop.location.lng);
                        const color = severityColors[crop.alertSeverity];

                        return (
                             <div
                                key={crop.id}
                                className={cn(
                                    "absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer transition-all duration-300",
                                     activeCropId === crop.id ? 'z-10' : 'z-0'
                                )}
                                style={{ top, left }}
                                onClick={() => onMarkerClick(crop.id)}
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded-full border-2 border-white shadow-lg",
                                    color,
                                    activeCropId === crop.id ? 'ring-4 ring-offset-2 ring-primary' : 'ring-0'
                                )}></div>
                                 <div className={cn(
                                    "absolute bottom-full mb-2 w-max px-3 py-1.5 text-sm font-semibold text-white rounded-md shadow-lg transition-all whitespace-nowrap",
                                    "transform -translate-x-1/2 left-1/2",
                                    color,
                                    activeCropId === crop.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                                )}>
                                    {crop.fieldName}
                                    <div className={cn("absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4", `border-t-${color.replace('bg-','')}`)}></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
