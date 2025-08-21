// src/hooks/use-transition.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface TransitionContextProps {
    isTransitioning: boolean;
    isInitialLoad: boolean;
    startTransition: (cropId: string) => void;
    endTransition: () => void;
    transitionCropId: string | null;
}

const TransitionContext = createContext<TransitionContextProps | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [transitionCropId, setTransitionCropId] = useState<string | null>(null);

    // Efeito para transição inicial ao carregar a página
    useEffect(() => {
        if (isInitialLoad) {
            setIsTransitioning(true);

            // Finalizar a transição inicial após a animação
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setIsInitialLoad(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isInitialLoad]);

    const startTransition = (cropId: string) => {
        setTransitionCropId(cropId);
        setIsTransitioning(true);

        // Finalizar a transição automaticamente após a animação
        setTimeout(() => {
            setIsTransitioning(false);
        }, 1000);
    };

    const endTransition = () => {
        setIsTransitioning(false);
        setTransitionCropId(null);
    };

    return (
        <TransitionContext.Provider value={{
            isTransitioning,
            isInitialLoad,
            startTransition,
            endTransition,
            transitionCropId
        }}>
            {children}
        </TransitionContext.Provider>
    );
}

export function useTransition() {
    const context = useContext(TransitionContext);
    if (context === undefined) {
        throw new Error('useTransition must be used within a TransitionProvider');
    }
    return context;
}