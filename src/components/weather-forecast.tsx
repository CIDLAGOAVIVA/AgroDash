
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
    <Card>
      <CardHeader>
        <CardTitle>Previsão do Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {weatherData.map((weather) => {
            const Icon = weather.icon;
            return (
              <div 
                key={weather.day} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-colors duration-200",
                  weather.isToday ? "bg-accent" : "hover:bg-muted/50"
                )}
              >
                <span className="w-10 font-bold text-base text-foreground">
                  {weather.day}
                </span>
                <div className="flex-1 flex justify-center">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <div className="flex items-baseline w-24 justify-end">
                    <span className="text-lg font-semibold text-foreground">{weather.high}°</span>
                    <span className="text-sm text-muted-foreground ml-2">{weather.low}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
