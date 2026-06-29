export interface Product {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  categoria_id: number;
  created_at?: Date;
  updated_at?: Date;
}
