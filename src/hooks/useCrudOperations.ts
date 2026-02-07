import { useState, useCallback } from 'react';

export interface CrudItem {
  id: string | number;
  [key: string]: any;
}

export const useCrudOperations = <T extends CrudItem>(initialData: T[]) => {
  const [data, setData] = useState<T[]>(initialData);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');

  const openAdd = useCallback(() => {
    setMode('add');
    setSelectedItem(null);
    setIsDialogOpen(true);
  }, []);

  const openEdit = useCallback((item: T) => {
    setMode('edit');
    setSelectedItem(item);
    setIsDialogOpen(true);
  }, []);

  const openView = useCallback((item: T) => {
    setMode('view');
    setSelectedItem(item);
    setIsDialogOpen(true);
  }, []);

  const handleAdd = useCallback((item: Omit<T, 'id'>) => {
    const newItem = { ...item, id: Date.now() } as T;
    setData(prev => [...prev, newItem]);
    setIsDialogOpen(false);
  }, []);

  const handleEdit = useCallback((item: T) => {
    setData(prev => prev.map(i => i.id === item.id ? item : i));
    setIsDialogOpen(false);
  }, []);

  const handleDelete = useCallback((id: string | number) => {
    setData(prev => prev.filter(i => i.id !== id));
  }, []);

  return {
    data,
    setData,
    selectedItem,
    mode,
    isDialogOpen,
    setIsDialogOpen,
    openAdd,
    openEdit,
    openView,
    handleAdd,
    handleEdit,
    handleDelete,
  };
};

export default useCrudOperations;