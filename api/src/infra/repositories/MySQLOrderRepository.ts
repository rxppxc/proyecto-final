import type { Connection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import type { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import type { Order } from '../../domain/entities/Order';

// Tipo auxiliar para las filas de pedidos
interface OrderRow extends RowDataPacket {
  id: number;
  fecha: Date;
  total: number;
  estado: 'pendiente' | 'completado' | 'cancelado';
}

// Tipo auxiliar para las filas de items de pedido
interface ItemRow extends RowDataPacket {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

// Tipo auxiliar para el resultado de ventas por categoría
interface VentasCategoriaRow extends RowDataPacket {
  categoria: string;
  total_ventas: number;
}

export class MySQLOrderRepository implements IOrderRepository {
  // Conexión inyectada desde app.ts
  constructor(private readonly connection: Connection) {}

  // ─── Retorna todos los pedidos ───────────────────────────────────────────────
  async findAll(): Promise<Order[]> {
    try {
      const [filas] = await this.connection.execute<OrderRow[]>(`
        SELECT id, fecha, total, estado
        FROM pedidos
        ORDER BY fecha DESC
      `);
      return filas.map((fila: OrderRow) => ({ ...fila }));
    } catch (error) {
      console.error('MySQLOrderRepository.findAll falló:', error);
      throw error;
    }
  }

  // ─── Busca un pedido por ID incluyendo sus items ────────────────────────────
  async findById(id: number): Promise<Order | null> {
    try {
      const [filas] = await this.connection.execute<OrderRow[]>(
        `SELECT id, fecha, total, estado FROM pedidos WHERE id = ?`,
        [id]
      );
      if (filas.length === 0) return null;

      const [items] = await this.connection.execute<ItemRow[]>(
        `SELECT id, pedido_id, producto_id, cantidad, precio_unitario
         FROM items_pedido WHERE pedido_id = ?`,
        [id]
      );

      return { ...filas[0], items: items.map((i: ItemRow) => ({ ...i })) };
    } catch (error) {
      console.error(`MySQLOrderRepository.findById (id=${id}) falló:`, error);
      throw error;
    }
  }

  // ─── Crea un pedido con transacción BEGIN/COMMIT/ROLLBACK ───────────────────
  // 1. INSERT en pedidos
  // 2. INSERT cada item en items_pedido
  // 3. UPDATE stock de cada producto
  async create(pedido: Order): Promise<Order> {
    await this.connection.beginTransaction();
    try {
      // 1. Insertar el pedido principal
      const [resultadoPedido] = await this.connection.execute<ResultSetHeader>(
        `INSERT INTO pedidos (total, estado) VALUES (?, ?)`,
        [pedido.total, pedido.estado ?? 'pendiente']
      );
      const pedidoId = resultadoPedido.insertId;

      // 2. Insertar cada item y 3. actualizar stock del producto
      if (pedido.items && pedido.items.length > 0) {
        for (const item of pedido.items) {
          // INSERT en items_pedido
          await this.connection.execute<ResultSetHeader>(
            `INSERT INTO items_pedido (pedido_id, producto_id, cantidad, precio_unitario)
             VALUES (?, ?, ?, ?)`,
            [pedidoId, item.producto_id, item.cantidad, item.precio_unitario]
          );

          // UPDATE stock del producto (stock = stock - cantidad)
          await this.connection.execute<ResultSetHeader>(
            `UPDATE productos SET stock = stock - ?, updated_at = NOW() WHERE id = ?`,
            [item.cantidad, item.producto_id]
          );
        }
      }

      // Todo salió bien, confirmamos la transacción
      await this.connection.commit();

      // Retornamos el pedido completo con el ID generado
      const pedidoCreado = await this.findById(pedidoId);
      if (!pedidoCreado) {
        throw new Error('No se pudo recuperar el pedido recién creado');
      }
      return { ...pedidoCreado, items: pedido.items };
    } catch (error) {
      // Algo falló, revertimos todos los cambios
      await this.connection.rollback();
      console.error('MySQLOrderRepository.create falló, rollback ejecutado:', error);
      throw error;
    }
  }

  // ─── Retorna total de ventas agrupado por categoría ─────────────────────────
  async getSalesByCategory(): Promise<{ categoria: string; total_ventas: number }[]> {
    try {
      const [filas] = await this.connection.execute<VentasCategoriaRow[]>(`
        SELECT
          c.nombre AS categoria,
          SUM(ip.cantidad * ip.precio_unitario) AS total_ventas
        FROM items_pedido ip
        INNER JOIN productos p ON ip.producto_id = p.id
        INNER JOIN categorias c ON p.categoria_id = c.id
        INNER JOIN pedidos pe ON ip.pedido_id = pe.id
        WHERE pe.estado = 'completado'
        GROUP BY c.id, c.nombre
        ORDER BY total_ventas DESC
      `);
      return filas.map((fila: VentasCategoriaRow) => ({
        categoria: fila.categoria,
        total_ventas: Number(fila.total_ventas),
      }));
    } catch (error) {
      console.error('MySQLOrderRepository.getSalesByCategory falló:', error);
      throw error;
    }
  }
}