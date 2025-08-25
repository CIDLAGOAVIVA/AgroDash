"use client";

import { initialCrops } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Leaf, Wheat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransition } from "@/hooks/use-transition";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Sprout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sprout"><path d="M7 20h10" /><path d="M12 20V4" /><path d="M12 4c0-2.21-1.79-4-4-4S4 1.79 4 4c0 .62.14 1.2.38 1.72" /><path d="M12 4c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .62-.14 1.2-.38 1.72" /></svg>
)

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


const cropIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "Soja": Leaf,
  "Milho": Sprout,
  "Trigo": Wheat,
};

const cropPositions: { [key: string]: string } = {
  "soy-1": "top-[30%] left-[25%]",
  "corn-1": "top-[55%] left-[50%]",
  "wheat-1": "top-[40%] left-[75%]",
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

  const handleCropClick = (cropId: string, href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(cropId);

    // Navegar após pequeno delay para permitir a animação iniciar
    setTimeout(() => {
      router.push(href);
    }, 300);
  };

  return (
    <div ref={containerRef} className="min-h-full w-full bg-background text-foreground flex flex-col items-center justify-center p-4 dashboard-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-5xl">
          Visão Geral da Fazenda
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Selecione uma cultura para ver os detalhes de monitoramento.
        </p>
      </div>
      <Card className="w-full max-w-6xl shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video w-full">
            <FarmMap />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            {initialCrops.map((crop) => {
              const CropIcon = cropIcons[crop.cropType] || Leaf;
              const positionClass = cropPositions[crop.id] || "top-1/2 left-1/2";
              return (
                <Link
                  key={crop.id}
                  href={`/dashboard/${crop.id}`}
                  className={cn("absolute transform -translate-x-1/2 -translate-y-1/2", positionClass)}
                  onClick={handleCropClick(crop.id, `/dashboard/${crop.id}`)}
                >
                  <div className="relative group">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/80 rounded-full flex items-center justify-center border-2 md:border-4 border-background/70 shadow-lg hover:scale-110 hover:bg-primary transition-all duration-300 cursor-pointer">
                      <CropIcon className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                    </div>
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-background text-foreground rounded-md shadow-lg text-sm font-semibold opacity-0 group-hover:opacity-100 group-hover:-bottom-16 transition-all duration-300 pointer-events-none">
                      {crop.fieldName}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-background"></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
