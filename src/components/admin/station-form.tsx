
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Station, Property } from '@/types';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  id: z.string().optional(),
  id_propriedade: z.string().min(1, "Propriedade é obrigatória"),
  nome_estacao: z.string().min(1, "Nome é obrigatório"),
  descricao_estacao: z.string().optional(),
});

interface StationFormProps {
  initialData?: Station;
  properties: Property[];
  onSave: (data: Omit<Station, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export const StationForm: React.FC<StationFormProps> = ({ initialData, properties, onSave, onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        id_propriedade: String(initialData.id_propriedade)
    } : { id_propriedade: '', nome_estacao: '', descricao_estacao: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id_propriedade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Propriedade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma propriedade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {properties.map(prop => (
                    <SelectItem key={prop.id} value={String(prop.id)}>{prop.nome_propriedade} (ID: {prop.id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nome_estacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Estação</FormLabel>
              <FormControl>
                <Input placeholder="Estação Principal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao_estacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Localizada perto do rio" {...field} />
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
