
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Sensor, Station } from '@/types';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  id: z.string().optional(),
  id_estacao: z.string().min(1, "Estação é obrigatória"),
  nome_sensor: z.string().min(1, "Nome é obrigatório"),
  descricao_sensor: z.string().optional(),
});

interface SensorFormProps {
  initialData?: Sensor;
  stations: Station[];
  onSave: (data: Omit<Sensor, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export const SensorForm: React.FC<SensorFormProps> = ({ initialData, stations, onSave, onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        id_estacao: String(initialData.id_estacao)
    } : { id_estacao: '', nome_sensor: '', descricao_sensor: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id_estacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma estação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stations.map(st => (
                    <SelectItem key={st.id} value={String(st.id)}>{st.nome_estacao} ({st.id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nome_sensor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Sensor</FormLabel>
              <FormControl>
                <Input placeholder="Sensor de Temperatura" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao_sensor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Mede a temperatura do ar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};
