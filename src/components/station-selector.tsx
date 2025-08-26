"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import type { DashboardStation } from "@/types";
import { stationIcons } from "@/lib/data";

interface StationSelectorProps {
    stations: DashboardStation[];
    selectedStationId: string;
    onStationChange: (stationId: string) => void;
}

export function StationSelector({ stations, selectedStationId, onStationChange }: StationSelectorProps) {
    // const selectedStation = stations.find(s => s.id === selectedStationId) || stations[0];
    // const StationIcon = stationIcons[selectedStation.name.split(' ')[1]] || MapPin;

    return (
        <Card className="bg-background w-full shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* <StationIcon className="h-5 w-5 text-primary" /> */}
                        <span>Estações de Monitoramento</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Select
                    value={selectedStationId}
                    onValueChange={onStationChange}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma estação" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Estações</SelectLabel>
                            {stations.map((station) => (
                                <SelectItem key={station.id} value={station.id}>
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const Icon = stationIcons[station.name.split(' ')[1]] || MapPin;
                                            return <Icon className="h-4 w-4 text-primary" />;
                                        })()}
                                        <span>{station.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div className="mt-4 text-sm text-muted-foreground">
                    {/* <p>{selectedStation.description}</p> */}
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {/* <div className="flex items-center gap-1">
							<span className="font-semibold">Latitude:</span>
							<span>{selectedStation.location.lat.toFixed(4)}</span>
						</div>
						<div className="flex items-center gap-1">
							<span className="font-semibold">Longitude:</span>
							<span>{selectedStation.location.lng.toFixed(4)}</span>
						</div> */}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}