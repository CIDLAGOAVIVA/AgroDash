
import { AdminClient } from "@/components/admin-client";
import { getProperties, getCrops, getStations, getSensors, getQuantities, getAlertCriteria } from "./actions";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const [properties, crops, stations, sensors, quantities, alertCriteria] = await Promise.all([
    getProperties(),
    getCrops(),
    getStations(),
    getSensors(),
    getQuantities(),
    getAlertCriteria(),
  ]);

  // Se alguma das chamadas falhou e retornou [], a página ainda renderizará com tabelas vazias.
  const data = {
    properties,
    crops,
    stations,
    sensors,
    quantities,
    alertCriteria,
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Painel de Administração</h1>
      <AdminClient initialData={data} />
    </div>
  );
}

    