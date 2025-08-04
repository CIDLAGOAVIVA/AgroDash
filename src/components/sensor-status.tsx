
"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Thermometer, Droplets, Wind, Cloud, Leaf, Waves } from 'lucide-react';
import type { ComponentType } from "react";

type Status = "Operacional" | "Falha" | "Manutenção";

export interface SensorStatusType {
  name: string;
  status: Status;
}

const statusConfig: { [key in Status]: { className: string, text: string } } = {
  "Operacional": { className: "bg-green-500", text: "Operacional" },
  "Falha": { className: "bg-red-500", text: "Falha" },
  "Manutenção": { className: "bg-yellow-500", text: "Manutenção" },
};

const iconMap: { [key: string]: ComponentType<{ className?: string }> } = {
    "Temp. Ar": Thermometer,
    "Umid. Ar": Droplets,
    "Vento": Wind,
    "CO2": Cloud,
    "Umid. Solo": Leaf,
    "Nitrogênio": Waves,
};

export function SensorStatus({ name, status }: SensorStatusType) {
    const config = statusConfig[status];
    const Icon = iconMap[name] || Leaf;

    return (
        <Card className="p-3 bg-muted/50 border-muted-foreground/20">
            <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <div className="flex items-center gap-1.5">
                        <div className={cn("h-2 w-2 rounded-full", config.className)}></div>
                        <p className="text-xs text-muted-foreground">{config.text}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
