import { IOrderRepository } from '../domain/repositories/IOrderRepository';
import { IOrderItemRepository } from '../domain/repositories/IOrderItemRepository';
import { Order } from '../domain/entities/Order';
import { OrderItem } from '../domain/entities/OrderItem';

interface ItemInput {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

interface CreateOrderInput {
  items: ItemInput[];
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderItemRepository: IOrderItemRepository
  ) {}

  async execute(datos: CreateOrderInput): Promise<Order> {
    // Validar que el pedido tenga al menos un item
    if (!datos.items || datos.items.length === 0)
      throw new Error('El pedido debe contener al menos un item');

    // Validar cada item individualmente
    for (const item of datos.items) {
      if (!item.producto_id)
        throw new Error('Cada item debe tener un producto_id válido');
      if (!item.cantidad || item.cantidad <= 0)
        throw new Error('La cantidad de cada item debe ser mayor a 0');
      if (!item.precio_unitario || item.precio_unitario <= 0)
        throw new Error('El precio unitario de cada item debe ser mayor a 0');
    }

    // Calcular el total del pedido
    const total = datos.items.reduce(
      (suma, item) => suma + item.cantidad * item.precio_unitario,
      0
    );

    // Crear el pedido en la base de datos
    const nuevoPedido = await this.orderRepository.create({
      total,
      estado: 'pendiente',
    });

    // Crear cada item asociado al pedido recién creado
    const itemsCreados: OrderItem[] = [];
    for (const item of datos.items) {
      const itemCreado = await this.orderItemRepository.create({
        pedido_id: nuevoPedido.id!,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      });
      itemsCreados.push(itemCreado);
    }

    // Retornar el pedido completo con sus items
    return { ...nuevoPedido, items: itemsCreados };
  }
}
