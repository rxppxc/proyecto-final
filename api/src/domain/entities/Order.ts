import { OrderItem } from './OrderItem';

export type OrderStatus = 'pendiente' | 'completado' | 'cancelado';

export interface Order {
  id?: number;
  fecha?: Date;
  total: number;
  estado?: OrderStatus;
  items?: OrderItem[];
}
