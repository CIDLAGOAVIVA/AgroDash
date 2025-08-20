
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
import { 
    saveProperty, deleteProperty, 
    saveCrop, deleteCrop,
    saveStation, deleteStation,
    saveSensor, deleteSensor,
    saveQuantity, deleteQuantity,
    saveAlertCriterion, deleteAlertCriterion
} from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';

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

type DataKeys = keyof AdminClientProps['initialData'];

export function AdminClient({ initialData }: AdminClientProps) {
  const { toast } = useToast();

  const handleSave = async (itemType: DataKeys, data: any) => {
    try {
      const type = itemType.slice(0, -1); // 'properties' -> 'propertie'
      const op = data.id ? 'atualizado' : 'criado';

      switch (itemType) {
        case 'properties': await saveProperty(data); break;
        case 'crops': await saveCrop(data); break;
        case 'stations': await saveStation(data); break;
        case 'sensors': await saveSensor(data); break;
        case 'quantities': await saveQuantity(data); break;
        case 'alertCriteria': await saveAlertCriterion(data); break;
      }
      toast({ title: "Sucesso!", description: `Item ${op} com sucesso.` });
    } catch (error) {
      console.error(`Error saving ${itemType}:`, error);
      toast({ title: "Erro!", description: `Não foi possível salvar o item.`, variant: 'destructive' });
    }
  };

  const handleDelete = async (itemType: DataKeys, item: {id: string}) => {
     if (!confirm('Tem certeza que deseja excluir este item? A ação não pode ser desfeita.')) {
      return;
    }
    try {
      switch (itemType) {
        case 'properties': await deleteProperty(item.id); break;
        case 'crops': await deleteCrop(item.id); break;
        case 'stations': await deleteStation(item.id); break;
        case 'sensors': await deleteSensor(item.id); break;
        case 'quantities': await deleteQuantity(item.id); break;
        case 'alertCriteria': await deleteAlertCriterion(item.id); break;
      }
       toast({ title: "Sucesso!", description: "Item excluído com sucesso." });
    } catch (error) {
       console.error(`Error deleting ${itemType}:`, error);
       toast({ title: "Erro!", description: "Não foi possível excluir o item. Verifique se ele não está sendo usado por outro registro.", variant: 'destructive' });
    }
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
  ];

  const alertCriteriaColumns = [
      { header: "Alerta", accessor: 'alerta' as const },
      { header: "Condição", accessor: 'comparacao' as const },
      { header: "Ativo", accessor: 'ativo' as const },
  ];

  return (
    <Tabs defaultValue="properties" className="w-full">
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
          data={initialData.properties}
          columns={propertyColumns}
          onDelete={(item) => handleDelete('properties', item)}
          onSave={(data) => handleSave('properties', data)}
          FormComponent={(props) => <PropertyForm {...props} />}
        />
      </TabsContent>

      <TabsContent value="crops">
        <CrudTable<AdminCrop>
          data={initialData.crops}
          columns={cropColumns}
          onDelete={(item) => handleDelete('crops', item)}
           onSave={(data) => handleSave('crops', data)}
          FormComponent={(props) => <CropForm {...props} properties={initialData.properties} />}
        />
      </TabsContent>
      
      <TabsContent value="stations">
        <CrudTable<Station>
          data={initialData.stations}
          columns={stationColumns}
          onDelete={(item) => handleDelete('stations', item)}
          onSave={(data) => handleSave('stations', data)}
          FormComponent={(props) => <StationForm {...props} properties={initialData.properties} />}
        />
      </TabsContent>

       <TabsContent value="sensors">
        <CrudTable<Sensor>
          data={initialData.sensors}
          columns={sensorColumns}
          onDelete={(item) => handleDelete('sensors', item)}
          onSave={(data) => handleSave('sensors', data)}
          FormComponent={(props) => <SensorForm {...props} stations={initialData.stations} />}
        />
      </TabsContent>

      <TabsContent value="quantities">
        <CrudTable<Quantity>
          data={initialData.quantities}
          columns={quantityColumns}
          onDelete={(item) => handleDelete('quantities', item)}
          onSave={(data) => handleSave('quantities', data)}
          FormComponent={(props) => <QuantityForm {...props} />}
        />
      </TabsContent>

      <TabsContent value="alert-criteria">
        <CrudTable<AlertCriterion>
            data={initialData.alertCriteria}
            columns={alertCriteriaColumns}
            onDelete={(item) => handleDelete('alertCriteria', item)}
            onSave={(data) => handleSave('alertCriteria', data)}
            FormComponent={(props) => <AlertCriteriaForm {...props} sensors={initialData.sensors} quantities={initialData.quantities} />}
        />
      </TabsContent>

    </Tabs>
  );
}
