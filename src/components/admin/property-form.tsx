
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Property } from '@/types';

const formSchema = z.object({
  id: z.string().optional(),
  nome_propriedade: z.string().min(1, "Nome é obrigatório"),
  municipio: z.string().min(1, "Município é obrigatório"),
  uf: z.string().length(2, "UF deve ter 2 caracteres").toUpperCase(),
});

interface PropertyFormProps {
  initialData?: Property;
  onSave: (data: Omit<Property, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSave, onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { nome_propriedade: '', municipio: '', uf: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome_propriedade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Propriedade</FormLabel>
              <FormControl>
                <Input placeholder="Fazenda São João" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="municipio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Município</FormLabel>
              <FormControl>
                <Input placeholder="São Paulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="uf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UF</FormLabel>
              <FormControl>
                <Input placeholder="SP" maxLength={2} {...field} />
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
