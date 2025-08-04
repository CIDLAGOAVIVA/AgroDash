
"use client";

import type { AlertEntry, AlertSeverity } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type SeverityConfig = {
    [key in AlertSeverity]: {
        icon: React.ComponentType<{ className?: string }>;
        className: string;
        iconColor: string;
    }
}

const severityConfig: SeverityConfig = {
    "Normal": {
        icon: ShieldCheck,
        className: "bg-primary/10 border-primary/20",
        iconColor: "text-primary"
    },
    "Atenção": {
        icon: ShieldAlert,
        className: "bg-yellow-500/10 border-yellow-500/20",
        iconColor: "text-yellow-500"
    },
    "Crítico": {
        icon: ShieldX,
        className: "bg-destructive/10 border-destructive/20",
        iconColor: "text-destructive"
    }
};

interface AlertLogProps {
    alerts: AlertEntry[];
}

export function AlertLog({ alerts }: AlertLogProps) {
    return (
        <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Log de Alertas</h3>
            <ScrollArea className="h-96 pr-4 border rounded-lg bg-background p-2">
                <div className="flex flex-col gap-3">
                    {alerts.map((alert, index) => {
                        const config = severityConfig[alert.severity];
                        const Icon = config.icon;
                        return (
                            <div key={index} className={cn("flex items-start gap-3 rounded-lg border p-3", config.className)}>
                                <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconColor)} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground leading-tight break-words">{alert.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
