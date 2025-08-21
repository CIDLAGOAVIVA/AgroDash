import { initialCrops } from "@/lib/data";

export async function generateStaticParams() {
    return initialCrops.map((crop) => ({
        cropId: crop.id,
    }));
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}