"use client";

import { initialProperties } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MapPin, Leaf, Wheat, Flower, Apple } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransition } from "@/hooks/use-transition";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Sprout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sprout"><path d="M7 20h10" /><path d="M12 20V4" /><path d="M12 4c0-2.21-1.79-4-4-4S4 1.79 4 4c0 .62.14 1.2.38 1.72" /><path d="M12 4c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .62-.14 1.2-.38 1.72" /></svg>
);

const Corn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v16" />
    <path d="M6 12c1 3 3 4 6 4s5-1 6-4c1-4-2-8-6-8s-7 4-6 8z" />
    <path d="M6 12c0 0 2 3 6 3s6-3 6-3" />
  </svg>
);

const Soybean = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 9c-.97.68-1.65 1.79-2 3 .35 1.21 1.03 2.32 2 3 .97-.68 1.65-1.79 2-3-.35-1.21-1.03-2.32-2-3z" />
    <path d="M15 9c-.97.68-1.65 1.79-2 3 .35 1.21 1.03 2.32 2 3 .97-.68 1.65-1.79 2-3-.35-1.21-1.03-2.32-2-3z" />
    <path d="M12 4c-.97.68-1.65 1.79-2 3 .35 1.21 1.03 2.32 2 3 .97-.68 1.65-1.79 2-3-.35-1.21-1.03-2.32-2-3z" />
    <path d="M12 14c-.97.68-1.65 1.79-2 3 .35 1.21 1.03 2.32 2 3 .97-.68 1.65-1.79 2-3-.35-1.21-1.03-2.32-2-3z" />
  </svg>
);

// Adicionar a definição de cropIcons
const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Soja": Soybean, // Use custom Soybean icon instead of Plant
  "Milho": Corn,
  "Trigo": Wheat,
};

const FarmMap = () => {
  const lat = -22.319792;
  const lng = -42.408717;
  const zoom = 15;
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <iframe
      className="absolute inset-0 w-full h-full border-0"
      src={mapUrl}
    ></iframe>
  );
};

export default function Home() {
  const { startTransition, isInitialLoad } = useTransition();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Efeito para aplicar uma classe de "entrada" quando a página carrega
  useEffect(() => {
    // Pequeno atraso para permitir que a transição de zoom termine primeiro
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.add('fade-in');
      }
    }, isInitialLoad ? 800 : 300);

    return () => clearTimeout(timer);
  }, [isInitialLoad]);

  const handlePropertyClick = (propertyId: string, href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(propertyId);

    // Navegar após pequeno delay para permitir a animação iniciar
    setTimeout(() => {
      router.push(href);
    }, 300);
  };

  return (
    <div ref={containerRef} className="min-h-full w-full bg-background text-foreground flex flex-col items-center justify-center p-4 dashboard-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-5xl">
          AgriDash
        </h1>
        <p className="mt-2 text-xl text-primary/80 font-medium">
          Dados que cultivam o futuro
        </p>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Selecione uma propriedade para ver as culturas disponíveis.
        </p>
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6">
        {initialProperties.map((property) => (
          <Card
            key={property.id}
            className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={handlePropertyClick(property.id, `/property/${property.id}`)}
          >
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {property.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex gap-2 mb-3">
                <Badge variant="outline" className="bg-primary/5">
                  {property.crops.length} culturas
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {property.crops.map(crop => {
                  const Icon = cropIcons[crop.cropType] || Leaf;
                  return (
                    <div key={crop.id} className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Icon className="h-3 w-3" />
                      <span>{crop.cropType}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
