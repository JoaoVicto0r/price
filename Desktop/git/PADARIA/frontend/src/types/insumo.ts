// Em src/types/insumo.ts
export interface InsumoFormValues {
  id?: string; // Opcional para criação
  name: string;
  description?: string;
  unit: string;
  unitCost: number;
  stock: number;
  minStock: number;
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
}