
"use client";

import { Sun, Cloud, CloudRain, CloudSun, CloudDrizzle, CloudLightning } from "lucide-react";
import { cn } from "@/lib/utils";

const weatherData = [
    { day: "Seg", icon: CloudSun, high: 28, isToday: true },
    { day: "Ter", icon: Sun, high: 30 },
    { day: "Qua", icon: Sun, high: 31 },
    { day: "Qui", icon: Cloud, high: 27 },
    { day: "Sex", icon: CloudRain, high: 25 },
    { day: "Sáb", icon: CloudDrizzle, high: 26 },
    { day: "Dom", icon: CloudLightning, high: 24 },
];

export function WeatherForecast() {
  return (
    <div className="flex flex-col bg-muted/30 rounded-lg p-2 border">
        <h3 className="text-sm font-semibold mb-2 text-foreground px-1">Previsão (7 dias)</h3>
        <div className="grid grid-cols-7 gap-1">
            {weatherData.map((weather) => {
                const Icon = weather.icon;
                return (
                <div 
                    key={weather.day} 
                    className={cn(
                    "flex flex-col items-center gap-1 p-1 rounded-md transition-colors duration-200",
                    weather.isToday ? "bg-accent/80" : ""
                    )}
                >
                    <span className="font-medium text-xs text-foreground">
                    {weather.day}
                    </span>
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">{weather.high}°</span>
                </div>
                );
            })}
        </div>
    </div>
  );
}
