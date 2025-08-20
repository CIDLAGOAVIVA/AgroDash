
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrudTable } from './admin/crud-table';
import { PropertyForm } from './admin/property-form';
import { CropForm } from './admin/crop-form';
import { StationForm } from './admin/station-form';
import { SensorForm } from './admin/sensor-form';
import { QuantityForm } from './admin/quantity-form';
import { AlertCriteriaForm } from './admin/alert-criteria-form';
import type { Property, AdminCrop, Station, Sensor, Quantity, AlertCriterion } from '@/types';

interface AdminClientProps {
  initialData: {
    properties: Property[];
    crops: AdminCrop[];
    stations: Station[];
    sensors: Sensor[];
    quantities: Quantity[];
    alertCriteria: AlertCriterion[];
  };
}

export function AdminClient({ initialData }: AdminClientProps) {
  const [data, setData] = useState(initialData);

  // Mock functions for CRUD operations. Replace with server actions.
  const handleDelete = (itemType: keyof typeof data, item: {id: string}) => {
    console.log(`Deleting ${itemType} with id ${item.id}`);
    setData(prev => ({
        ...prev,
        [itemType]: prev[itemType].filter((i: {id: string}) => i.id !== item.id)
    }));
  };
  
  const propertyColumns = [
    { header: "Nome", accessor: 'nome_propriedade' as const },
    { header: "Município", accessor: 'municipio' as const },
    { header: "UF", accessor: 'uf' as const },
  ];

  const cropColumns = [
    { header: "Cultura", accessor: 'cropType' as const },
    { header: "Campo", accessor: 'fieldName' as const },
  ];

  const stationColumns = [
      { header: "Nome", accessor: 'nome_estacao' as const },
      { header: "Descrição", accessor: 'descricao_estacao' as const },
  ];

  const sensorColumns = [
      { header: "Nome", accessor: 'nome_sensor' as const },
      { header: "Descrição", accessor: 'descricao_sensor' as const },
  ];

  const quantityColumns = [
      { header: "Grandeza", accessor: 'nome_grandeza' as const },
      { header: "Unidade", accessor: 'unidade_medida' as const },
      { header: "Descrição", accessor: 'descricao_grandeza' as const },
  ];

  const alertCriteriaColumns = [
      { header: "Alerta", accessor: 'alerta' as const },
      { header: "Condição", accessor: 'comparacao' as const },
      { header: "Valor Crítico", accessor: 'valor_critico_1' as const },
      { header: "Ativo", accessor: 'ativo' as const },
  ];

  return (
    <Tabs defaultValue="properties">
      <TabsList>
        <TabsTrigger value="properties">Propriedades</TabsTrigger>
        <TabsTrigger value="crops">Culturas</TabsTrigger>
        <TabsTrigger value="stations">Estações</TabsTrigger>
        <TabsTrigger value="sensors">Sensores</TabsTrigger>
        <TabsTrigger value="quantities">Grandezas</TabsTrigger>
        <TabsTrigger value="alert-criteria">Critérios de Alerta</TabsTrigger>
      </TabsList>

      <TabsContent value="properties">
        <CrudTable<Property>
          data={data.properties}
          columns={propertyColumns}
          onDelete={(item) => handleDelete('properties', item)}
          FormComponent={(props) => <PropertyForm {...props} />}
        />
      </TabsContent>

      <TabsContent value="crops">
        <CrudTable<AdminCrop>
          data={data.crops}
          columns={cropColumns}
          onDelete={(item) => handleDelete('crops', item)}
          FormComponent={(props) => <CropForm {...props} properties={data.properties} />}
        />
      </TabsContent>
      
      <TabsContent value="stations">
        <CrudTable<Station>
          data={data.stations}
          columns={stationColumns}
          onDelete={(item) => handleDelete('stations', item)}
          FormComponent={(props) => <StationForm {...props} properties={data.properties} />}
        />
      </TabsContent>

       <TabsContent value="sensors">
        <CrudTable<Sensor>
          data={data.sensors}
          columns={sensorColumns}
          onDelete={(item) => handleDelete('sensors', item)}
          FormComponent={(props) => <SensorForm {...props} stations={data.stations} />}
        />
      </TabsContent>

      <TabsContent value="quantities">
        <CrudTable<Quantity>
          data={data.quantities}
          columns={quantityColumns}
          onDelete={(item) => handleDelete('quantities', item)}
          FormComponent={(props) => <QuantityForm {...props} />}
        />
      </TabsContent>

      <TabsContent value="alert-criteria">
        <CrudTable<AlertCriterion>
            data={data.alertCriteria}
            columns={alertCriteriaColumns}
            onDelete={(item) => handleDelete('alertCriteria', item)}
            FormComponent={(props) => <AlertCriteriaForm {...props} sensors={data.sensors} quantities={data.quantities} />}
        />
      </TabsContent>

    </Tabs>
  );
}
