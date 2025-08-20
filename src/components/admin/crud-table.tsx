
"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AlertCriterion } from '@/types';

// Definindo um tipo mais genérico para o FormComponent
type FormComponentProps<T> = {
    initialData?: T;
    onSave: (data: T) => void;
    onClose: () => void;
    [key: string]: any; // Permite outras props como 'properties', 'stations', etc.
};

interface CrudTableProps<T extends { id: any }> {
  title: string;
  data: T[];
  columns: { header: string; accessor: keyof T, render?: (item: T) => React.ReactNode }[];
  FormComponent: React.FC<FormComponentProps<T>>;
  formProps?: Omit<FormComponentProps<T>, 'initialData' | 'onSave' | 'onClose'>;
  onSave: (data: T) => Promise<void>;
  onDelete: (item: T) => Promise<void>;
  isUpdating: boolean;
}

export function CrudTable<T extends { id: any }>({ 
  title, 
  data, 
  columns, 
  FormComponent, 
  formProps,
  onSave, 
  onDelete,
  isUpdating
}: CrudTableProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | undefined>(undefined);

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsDialogOpen(true);
  };

  const handleSave = async (item: T) => {
    await onSave(item);
    setIsDialogOpen(false);
    setEditingItem(undefined);
  };

  const handleDelete = async (item: T) => {
    await onDelete(item);
  };

  const renderCell = (item: T, col: CrudTableProps<T>['columns'][0]) => {
    if (col.render) {
        return col.render(item);
    }
    const value = item[col.accessor];
    if (typeof value === 'boolean') {
        return value ? 'Sim' : 'Não';
    }
    if (value instanceof Date) {
        return value.toLocaleDateString('pt-BR');
    }
    return String(value ?? '');
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button onClick={handleAddNew} disabled={isUpdating}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Novo
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.accessor)}>{col.header}</TableHead>
              ))}
              <TableHead className="text-right w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isUpdating ? (
                <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                        <div className="flex justify-center items-center">
                            <div className="spinner"></div>
                        </div>
                    </TableCell>
                </TableRow>
             ) : data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                        Nenhum registro encontrado.
                    </TableCell>
                </TableRow>
             ) : (
                data.map((item) => (
                <TableRow key={item.id}>
                    {columns.map((col) => (
                    <TableCell key={String(col.accessor)} className="py-2 px-4">
                       {renderCell(item, col)}
                    </TableCell>
                    ))}
                    <TableCell className="text-right py-2 px-4">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} disabled={isUpdating}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item)} disabled={isUpdating}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                         <span className="sr-only">Excluir</span>
                    </Button>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar" : "Adicionar"} {title}</DialogTitle>
          </DialogHeader>
          <FormComponent
            key={editingItem?.id || 'new'}
            initialData={editingItem}
            onSave={handleSave}
            onClose={() => setIsDialogOpen(false)}
            {...formProps}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

    