
"use client";
import { DashboardClient } from "@/components/dashboard-client";
import { initialCrops } from "@/lib/data";
import { notFound } from "next/navigation";
import { useEffect, useState, use } from "react";
import { useTransition } from "@/hooks/use-transition";

export default function DashboardPage({ params }: { params: { cropId: string } | Promise<{ cropId: string }> }) {
  // Desembrulha o objeto params usando React.use()
  const resolvedParams = typeof params === 'object' && !('then' in params)
    ? params
    : use(params as Promise<{ cropId: string }>);
import type { DashboardCrop } from "@/types";

  const crop = initialCrops.find((c) => c.id === resolvedParams.cropId);
  const { isInitialLoad } = useTransition();
  const [isReady, setIsReady] = useState(!isInitialLoad);

  useEffect(() => {
    if (!isInitialLoad) {
      setIsReady(true);
    }
  }, [isInitialLoad]);

  if (!crop) {
    notFound();
  }

  // Não renderiza nada enquanto estiver na transição inicial
  if (!isReady) {
    return null;
  }

  return <DashboardClient initialCrop={crop} allCrops={initialCrops} />;
}

