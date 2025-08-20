
import { AdminClient } from "@/components/admin-client";
import { initialProperties, initialCrops, initialStations, initialSensors, initialQuantities, initialAlertCriteria } from "@/lib/data";

export default async function AdminPage() {
  // Usando dados simulados para evitar erros de conexão com o banco de dados
  const data = {
    properties: initialProperties,
    crops: initialCrops.map(c => ({ id: c.id, propertyId: 'prop-1', cropType: c.cropType, fieldName: c.fieldName })), // Adaptando para o tipo AdminCrop
    stations: initialStations,
    sensors: initialSensors,
    quantities: initialQuantities,
    alertCriteria: initialAlertCriteria,
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Painel de Administração (Dados Simulados)</h1>
      <AdminClient initialData={data} />
    </div>
  );
}
