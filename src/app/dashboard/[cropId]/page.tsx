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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          {crop.fieldName}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Painel de Monitoramento Inteligente para {crop.cropType}
        </p>
      </header>
      <DashboardClient initialCrop={crop} />
    </div>
  );
}
