import { DashboardClient } from "@/components/dashboard-client";
import { initialCrops } from "@/lib/data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return initialCrops.map((crop) => ({
    cropId: crop.id,
  }));
}

export default function DashboardPage({ params }: { params: { cropId: string } }) {
  const crop = initialCrops.find((c) => c.id === params.cropId);

  if (!crop) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {crop.fieldName}
            </h1>
            <p className="mt-1 text-md text-muted-foreground">
            Painel de Monitoramento Inteligente para {crop.cropType}
            </p>
        </div>
      </header>
      <DashboardClient initialCrop={crop} />
    </div>
  );
}
