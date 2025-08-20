
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Quantity } from '@/types';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  id: z.string().optional(),
  nome_grandeza: z.string().min(1, "Nome é obrigatório"),
  unidade_medida: z.string().optional(),
  descricao_grandeza: z.string().optional(),
});

interface QuantityFormProps {
  initialData?: Quantity;
  onSave: (data: Omit<Quantity, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export const QuantityForm: React.FC<QuantityFormProps> = ({ initialData, onSave, onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { nome_grandeza: '', unidade_medida: '', descricao_grandeza: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome_grandeza"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Grandeza</FormLabel>
              <FormControl>
                <Input placeholder="Temperatura" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unidade_medida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade de Medida</FormLabel>
              <FormControl>
                <Input placeholder="°C" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao_grandeza"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Temperatura do ar" {...field} />
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
