
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";

const weatherData = [
    { day: "Seg", icon: CloudSun, high: 28, low: 18, isToday: true },
    { day: "Ter", icon: Sun, high: 30, low: 19 },
    { day: "Qua", icon: Sun, high: 31, low: 20 },
    { day: "Qui", icon: Cloud, high: 27, low: 19 },
    { day: "Sex", icon: CloudRain, high: 25, low: 17 },
];

export function WeatherForecast() {
  return (
    <div className="flex flex-col h-full bg-muted/30 rounded-lg p-4 border">
        <h3 className="text-base font-semibold mb-3 text-foreground">Previsão do Tempo</h3>
        <div className="flex flex-col gap-3 flex-grow justify-around">
        {weatherData.map((weather) => {
            const Icon = weather.icon;
            return (
            <div 
                key={weather.day} 
                className={cn(
                "flex items-center justify-between p-2 rounded-md transition-colors duration-200",
                weather.isToday ? "bg-accent/80" : ""
                )}
            >
                <span className="w-10 font-bold text-base text-foreground">
                {weather.day}
                </span>
                <div className="flex-1 flex justify-center">
                <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-baseline w-20 justify-end">
                    <span className="text-base font-semibold text-foreground">{weather.high}°</span>
                    <span className="text-sm text-muted-foreground ml-2">{weather.low}°</span>
                </div>
            </div>
            );
        })}
        </div>
    </div>
  );
}
