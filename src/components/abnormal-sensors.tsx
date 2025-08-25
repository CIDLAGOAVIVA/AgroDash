"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { SensorStatus } from "./sensor-status";
import { Badge } from "./ui/badge";

interface AbnormalSensorsProps {
    sensors: {
        name: string;
        value: number | string;
        unit?: string;
        status: "Operacional" | "Falha" | "Manutenção";
        threshold?: {
            min?: number;
            max?: number;
        };
    }[];
}

export function AbnormalSensors({ sensors }: AbnormalSensorsProps) {
    const abnormalSensors = sensors.filter(s =>
        s.status === "Falha" ||
        s.status === "Manutenção" ||
        (typeof s.value === "number" &&
            s.threshold &&
            ((s.threshold.min !== undefined && s.value < s.threshold.min) ||
                (s.threshold.max !== undefined && s.value > s.threshold.max)))
    );

    if (abnormalSensors.length === 0) {
        return (
            <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <span className="bg-green-500 p-1 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>
                        </span>
                        Todos os sensores operando normalmente
                    </CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Sensores que precisam de atenção
                    <Badge variant="outline" className="ml-auto bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700">
                        {abnormalSensors.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {abnormalSensors.map((sensor, i) => (
                    <div key={i} className="flex flex-col gap-1 p-2 bg-white dark:bg-black/20 rounded-md border border-amber-200 dark:border-amber-800">
                        <SensorStatus name={sensor.name} status={sensor.status} />
                        <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                            <span>Valor atual: <span className="font-medium text-foreground">{sensor.value}{sensor.unit || ''}</span></span>
                            {sensor.threshold && (
                                <span className="text-amber-600 dark:text-amber-400">
                                    {sensor.threshold.min !== undefined && sensor.threshold.max !== undefined ?
                                        `Normal: ${sensor.threshold.min}-${sensor.threshold.max}${sensor.unit || ''}` :
                                        sensor.threshold.min !== undefined ?
                                            `Mínimo: ${sensor.threshold.min}${sensor.unit || ''}` :
                                            `Máximo: ${sensor.threshold.max}${sensor.unit || ''}`
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}