
import { AdminClient } from "@/components/admin-client";
import { getProperties, getCrops, getStations, getSensors, getQuantities, getAlertCriteria } from "@/app/admin/actions";

export default async function AdminPage() {
  // Buscando dados diretamente do banco de dados através das Server Actions
  const properties = await getProperties();
  const crops = await getCrops();
  const stations = await getStations();
  const sensors = await getSensors();
  const quantities = await getQuantities();
  const alertCriteria = await getAlertCriteria();

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
