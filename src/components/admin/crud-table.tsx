
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

// Definindo um tipo mais genérico para o FormComponent
type FormComponentProps<T> = {
    initialData?: T;
    onSave: (data: T) => void;
    onClose: () => void;
    [key: string]: any; // Permite outras props como 'properties', 'stations', etc.
};

interface CrudTableProps<T> {
  data: T[];
  columns: { header: string; accessor: keyof T, render?: (item: T) => React.ReactNode }[];
  FormComponent: React.FC<FormComponentProps<T>>;
  onSave: (data: T) => void;
  onDelete: (item: T) => void;
}

export function CrudTable<T extends { id: string }>({ data, columns, FormComponent, onSave, onDelete }: CrudTableProps<T>) {
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

  const handleDelete = (item: T) => {
    onDelete(item);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
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
              <TableHead className="text-right w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {data.length === 0 ? (
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
                        {col.render ? col.render(item) : String(item[col.accessor] ?? '')}
                    </TableCell>
                    ))}
                    <TableCell className="text-right py-2 px-4">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Item" : "Adicionar Novo Item"}</DialogTitle>
          </DialogHeader>
          {/* O `key` força a remontagem do formulário, limpando o estado antigo */}
          <FormComponent
            key={editingItem?.id || 'new'}
            initialData={editingItem}
            onSave={handleSave}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
