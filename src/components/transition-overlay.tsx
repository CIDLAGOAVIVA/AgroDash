// src/components/transition-overlay.tsx
"use client";

import { useTransition } from "@/hooks/use-transition";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

export function TransitionOverlay() {
    const { isTransitioning, isInitialLoad, transitionCropId } = useTransition();
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        if (isTransitioning || isInitialLoad) {
            setShowOverlay(true);
        } else {
            // Pequeno atraso para permitir que a animação complete antes de remover o overlay
            const timer = setTimeout(() => {
                setShowOverlay(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning, isInitialLoad]);

    if (!showOverlay) return null;

    return (
        <div
            className={cn(
                "transition-overlay",
                isTransitioning && "active",
                isInitialLoad && !isTransitioning && "initial-load"
            )}
        >
            <div className="logo-container flex items-center gap-2">
                <Leaf className="h-10 w-10 text-primary" />
                <span className="text-2xl font-bold text-primary">AgriDash</span>
            </div>
        </div>
    );
}