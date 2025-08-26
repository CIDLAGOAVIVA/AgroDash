import { initialProperties } from "@/lib/data";

export async function generateStaticParams() {
    return initialProperties.map((property) => ({
        propertyId: property.id,
    }));
}

export default function PropertyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}