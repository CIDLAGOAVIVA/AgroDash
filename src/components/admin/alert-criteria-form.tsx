
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { AlertCriterion, Sensor, Quantity } from '@/types';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  id: z.string().optional(),
  id_sensor: z.string().min(1, "Sensor é obrigatório"),
  id_grandeza: z.string().min(1, "Grandeza é obrigatória"),
  comparacao: z.enum(['>', '<', '>=', '<=', '==', '!=', 'entre']),
  valor_critico_1: z.coerce.number(),
  valor_critico_2: z.coerce.number().optional(),
  alerta: z.string().min(1, "Mensagem de alerta é obrigatória"),
  repeticao_seg: z.coerce.number().int().positive(),
  ativo: z.boolean(),
});

interface AlertCriteriaFormProps {
  initialData?: AlertCriterion;
  sensors: Sensor[];
  quantities: Quantity[];
  onSave: (data: AlertCriterion) => void;
  onClose: () => void;
}

export const AlertCriteriaForm: React.FC<AlertCriteriaFormProps> = ({ initialData, sensors, quantities, onSave, onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      id_sensor: '',
      id_grandeza: '',
      comparacao: '>',
      valor_critico_1: 0,
      valor_critico_2: 0,
      alerta: '',
      repeticao_seg: 300,
      ativo: true,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values as AlertCriterion);
  };
  
  const comparacao = form.watch('comparacao');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id_sensor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sensor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Selecione um sensor" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sensors.map(s => <SelectItem key={s.id} value={s.id}>{s.nome_sensor}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id_grandeza"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grandeza</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Selecione uma grandeza" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {quantities.map(q => <SelectItem key={q.id} value={q.id}>{q.nome_grandeza}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comparacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condição</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value=">">Maior que</SelectItem>
                  <SelectItem value="<">Menor que</SelectItem>
                  <SelectItem value=">=">Maior ou igual a</SelectItem>
                  <SelectItem value="<=">Menor ou igual a</SelectItem>
                  <SelectItem value="==">Igual a</SelectItem>
                  <SelectItem value="!=">Diferente de</SelectItem>
                  <SelectItem value="entre">Entre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valor_critico_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{comparacao === 'entre' ? 'Valor Mínimo' : 'Valor Crítico'}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {comparacao === 'entre' && (
             <FormField
                control={form.control}
                name="valor_critico_2"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Valor Máximo</FormLabel>
                    <FormControl>
                    <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          )}
        </div>
        <FormField
          control={form.control}
          name="alerta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem de Alerta</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: Temperatura muito alta!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
            control={form.control}
            name="repeticao_seg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intervalo do Alerta (segundos)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Critério Ativo</FormLabel>
              </div>
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
