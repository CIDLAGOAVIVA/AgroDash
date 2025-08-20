
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AdminCrop, Property } from '@/types';

const formSchema = z.object({
  id: z.string().optional(),
  propertyId: z.string().min(1, "Propriedade é obrigatória"),
  cropType: z.string().min(1, "Tipo de cultura é obrigatório"),
  fieldName: z.string().min(1, "Nome do campo é obrigatório"),
});

interface CropFormProps {
  initialData?: AdminCrop;
  properties: Property[];
  onSave: (data: Omit<AdminCrop, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export const CropForm: React.FC<CropFormProps> = ({ initialData, properties, onSave, onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        propertyId: String(initialData.propertyId),
    } : { propertyId: '', cropType: '', fieldName: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="propertyId"
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
          name="cropType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Cultura (Produto)</FormLabel>
              <FormControl>
                <Input placeholder="Soja" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fieldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Campo (Cultura)</FormLabel>
              <FormControl>
                <Input placeholder="Campo Norte" {...field} />
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
