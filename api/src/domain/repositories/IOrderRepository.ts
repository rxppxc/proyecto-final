import type { Order } from '../entities/Order';

// Contrato para el repositorio de pedidos
export interface IOrderRepository {
  // Retorna todos los pedidos registrados
  findAll(): Promise<Order[]>;

  // Busca un pedido por su ID, retorna null si no existe
  findById(id: number): Promise<Order | null>;

  // Persiste un nuevo pedido y retorna el registro creado
  create(pedido: Order): Promise<Order>;

  // Retorna el total de ventas agrupado por categoría
  getSalesByCategory(): Promise<{ categoria: string; total_ventas: number }[]>;
}
