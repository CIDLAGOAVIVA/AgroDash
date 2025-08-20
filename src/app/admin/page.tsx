
import { AdminClient } from "@/components/admin-client";
import { initialCrops, initialProperties, initialStations, initialSensors, initialQuantities, initialAlertCriteria } from "@/lib/data";

export default function AdminPage() {
  // No futuro, esses dados virão do banco de dados.
  const data = {
    properties: initialProperties,
    crops: initialCrops.map(c => ({...c, propertyId: 'prop-1'})), // Adicionando mock propertyId
    stations: initialStations,
    sensors: initialSensors,
    quantities: initialQuantities,
    alertCriteria: initialAlertCriteria,
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Painel de Administração</h1>
      <AdminClient initialData={data} />
    </div>
  );
}
