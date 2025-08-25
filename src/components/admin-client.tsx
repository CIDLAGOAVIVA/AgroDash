
"use client";

import { useState, useTransition } from 'react';
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
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: () => Promise<any>, messages: {loading: string, success: string, error: string}) => {
    startTransition(async () => {
      try {
        await action();
        toast({ title: "Sucesso!", description: messages.success });
      } catch (error) {
        console.error(messages.error, error);
        toast({ title: "Erro!", description: `Não foi possível completar a ação. Verifique o console para mais detalhes.`, variant: 'destructive' });
      }
    });
  };

  const onSave = (itemType: DataKeys, data: any) => {
    let action;
    const op = data.id ? 'atualizar' : 'criar';

    // Para critério de alerta, a chave pode ser composta e precisamos dos valores originais para o UPDATE
    if (itemType === 'alertCriteria' && data.id) {
        const [id_sensor_original, id_grandeza_original] = data.id.split('-');
        data.id_sensor_original = id_sensor_original;
        data.id_grandeza_original = id_grandeza_original;
    }


    switch (itemType) {
      case 'properties': action = () => saveProperty(data); break;
      case 'crops': action = () => saveCrop(data); break;
      case 'stations': action = () => saveStation(data); break;
      case 'sensors': action = () => saveSensor(data); break;
      case 'quantities': action = () => saveQuantity(data); break;
      case 'alertCriteria': action = () => saveAlertCriterion(data); break;
      default: return;
    }
    handleAction(action, {
      loading: `Salvando...`,
      success: `Item ${op} com sucesso.`,
      error: `Erro ao salvar item.`
    });
  };

  const onDelete = (itemType: DataKeys, item: {id: any}) => {
    if (!confirm('Tem certeza que deseja excluir este item? A ação não pode ser desfeita.')) return;
    
    let action;
     // Para critério de alerta, a chave é composta
    const idToDelete = itemType === 'alertCriteria' 
        ? { sensorId: (item as any).id_sensor, quantityId: (item as any).id_grandeza } 
        : item.id;

    switch (itemType) {
        case 'properties': action = () => deleteProperty(idToDelete); break;
        case 'crops': action = () => deleteCrop(idToDelete); break;
        case 'stations': action = () => deleteStation(idToDelete); break;
        case 'sensors': action = () => deleteSensor(idToDelete); break;
        case 'quantities': action = () => deleteQuantity(idToDelete); break;
        case 'alertCriteria': action = () => deleteAlertCriterion(idToDelete); break;
        default: return;
    }
    handleAction(action, {
        loading: 'Excluindo...',
        success: 'Item excluído com sucesso.',
        error: 'Erro ao excluir item.'
    });
  };
  
  const propertyColumns = [
    { header: "ID", accessor: 'id' as const },
    { header: "Nome", accessor: 'nome_propriedade' as const },
    { header: "Município", accessor: 'municipio' as const },
    { header: "UF", accessor: 'uf' as const },
  ];

  const cropColumns = [
    { header: "ID", accessor: 'id' as const },
    { header: "Cultura", accessor: 'cropType' as const },
    { header: "Campo", accessor: 'fieldName' as const },
    { header: "ID Propriedade", accessor: 'propertyId' as const },
  ];

  const stationColumns = [
      { header: "ID", accessor: 'id' as const },
      { header: "Nome", accessor: 'nome_estacao' as const },
      { header: "Descrição", accessor: 'descricao_estacao' as const },
      { header: "ID Propriedade", accessor: 'id_propriedade' as const },
  ];

  const sensorColumns = [
      { header: "ID", accessor: 'id' as const },
      { header: "Nome", accessor: 'nome_sensor' as const },
      { header: "ID Estação", accessor: 'id_estacao' as const },
  ];

  const quantityColumns = [
      { header: "ID", accessor: 'id' as const },
      { header: "Grandeza", accessor: 'nome_grandeza' as const },
      { header: "Unidade", accessor: 'unidade_medida' as const },
      { 
        header: "Descrição", 
        accessor: 'descricao_grandeza' as const,
        render: (item: any) => (
          <span className="text-sm text-muted-foreground">
            {item.descricao_grandeza || '-'}
          </span>
        )
      },
  ];

  const alertCriteriaColumns = [
      { header: "ID Sensor", accessor: 'id_sensor' as const },
      { header: "ID Grandeza", accessor: 'id_grandeza' as const },
      { header: "Alerta", accessor: 'alerta' as const },
      { header: "Condição", accessor: 'comparacao' as const },
      { header: "Valor 1", accessor: 'valor_critico_1' as const },
      { header: "Ativo", accessor: 'ativo' as const },
  ];

  return (
    <Tabs defaultValue="properties" className="w-full">
      <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full h-auto mb-4">
        <TabsTrigger value="properties">Propriedades</TabsTrigger>
        <TabsTrigger value="crops">Culturas</TabsTrigger>
        <TabsTrigger value="stations">Estações</TabsTrigger>
        <TabsTrigger value="sensors">Sensores</TabsTrigger>
        <TabsTrigger value="quantities">Grandezas</TabsTrigger>
        <TabsTrigger value="alert-criteria">Critérios de Alerta</TabsTrigger>
      </TabsList>

      <TabsContent value="properties">
        <CrudTable<Property>
          title="Propriedades"
          data={initialData.properties}
          columns={propertyColumns}
          onDelete={(item) => onDelete('properties', item)}
          onSave={(data) => onSave('properties', data)}
          isUpdating={isPending}
          FormComponent={PropertyForm}
        />
      </TabsContent>

      <TabsContent value="crops">
        <CrudTable<AdminCrop>
          title="Culturas"
          data={initialData.crops}
          columns={cropColumns}
          onDelete={(item) => onDelete('crops', item)}
          onSave={(data) => onSave('crops', data)}
          isUpdating={isPending}
          FormComponent={CropForm}
          formProps={{ properties: initialData.properties }}
        />
      </TabsContent>
      
      <TabsContent value="stations">
        <CrudTable<Station>
          title="Estações"
          data={initialData.stations}
          columns={stationColumns}
          onDelete={(item) => onDelete('stations', item)}
          onSave={(data) => onSave('stations', data)}
          isUpdating={isPending}
          FormComponent={StationForm}
          formProps={{ properties: initialData.properties }}
        />
      </TabsContent>

       <TabsContent value="sensors">
        <CrudTable<Sensor>
          title="Sensores"
          data={initialData.sensors}
          columns={sensorColumns}
          onDelete={(item) => onDelete('sensors', item)}
          onSave={(data) => onSave('sensors', data)}
          isUpdating={isPending}
          FormComponent={SensorForm}
          formProps={{ stations: initialData.stations }}
        />
      </TabsContent>

      <TabsContent value="quantities">
        <CrudTable<Quantity>
          title="Grandezas"
          data={initialData.quantities}
          columns={quantityColumns}
          onDelete={(item) => onDelete('quantities', item)}
          onSave={(data) => onSave('quantities', data)}
          isUpdating={isPending}
          FormComponent={QuantityForm}
        />
      </TabsContent>

      <TabsContent value="alert-criteria">
        <CrudTable<AlertCriterion>
            title="Critérios de Alerta"
            data={initialData.alertCriteria}
            columns={alertCriteriaColumns}
            onDelete={(item) => onDelete('alertCriteria', item)}
            onSave={(data) => onSave('alertCriteria', data)}
            isUpdating={isPending}
            FormComponent={AlertCriteriaForm}
            formProps={{ sensors: initialData.sensors, quantities: initialData.quantities }}
        />
      </TabsContent>

    </Tabs>
  );
}
