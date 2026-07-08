import type { OrderItem } from '../entities/OrderItem';

// Contrato para el repositorio de items de pedido
export interface IOrderItemRepository {
  // Obtiene todos los items pertenecientes a un pedido
  findByOrderId(pedido_id: number): Promise<OrderItem[]>;

  // Persiste un nuevo item de pedido y retorna el registro creado
  create(item: OrderItem): Promise<OrderItem>;
}
