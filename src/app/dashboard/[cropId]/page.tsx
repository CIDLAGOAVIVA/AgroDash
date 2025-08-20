
import { DashboardClient } from "@/components/dashboard-client";
import { initialCrops } from "@/lib/data";
import { notFound } from "next/navigation";
import type { DashboardCrop } from "@/types";

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
      <DashboardClient initialCrop={crop as DashboardCrop} />
  );
}
