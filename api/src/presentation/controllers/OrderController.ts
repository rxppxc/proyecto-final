import type { Request, Response } from 'express';
import type { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { CreateOrderUseCase } from '../../usecases/CreateOrderUseCase';
import { GetSalesByCategoryUseCase } from '../../usecases/GetSalesByCategoryUseCase';

export class OrderController {
  private readonly crearPedido: CreateOrderUseCase;
  private readonly obtenerVentasPorCategoria: GetSalesByCategoryUseCase;

  constructor(private readonly orderRepository: IOrderRepository) {
    this.crearPedido = new CreateOrderUseCase(orderRepository);
    this.obtenerVentasPorCategoria = new GetSalesByCategoryUseCase(orderRepository);
  }

  // ─── GET /api/pedidos ────────────────────────────────────────────────────────
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const pedidos = await this.orderRepository.findAll();
      res.status(200).json({ data: pedidos, message: 'Pedidos obtenidos correctamente', error: null });
    } catch (error) {
      res.status(500).json({ data: null, message: 'Error al obtener pedidos', error: String(error) });
    }
  };

  // ─── GET /api/pedidos/:id ────────────────────────────────────────────────────
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ data: null, message: 'ID inválido', error: 'El ID debe ser un número' });
        return;
      }
      const pedido = await this.orderRepository.findById(id);
      if (!pedido) {
        res.status(404).json({ data: null, message: 'Pedido no encontrado', error: `No existe pedido con id ${id}` });
        return;
      }
      res.status(200).json({ data: pedido, message: 'Pedido obtenido correctamente', error: null });
    } catch (error) {
      res.status(500).json({ data: null, message: 'Error al obtener el pedido', error: String(error) });
    }
  };

  // ─── POST /api/pedidos ───────────────────────────────────────────────────────
  // Valida que items[] no venga vacío antes de ejecutar el use case
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ data: null, message: 'El pedido debe contener al menos un item', error: 'items[] vacío o no enviado' });
        return;
      }
      const pedido = await this.crearPedido.execute(req.body);
      res.status(201).json({ data: pedido, message: 'Pedido creado correctamente', error: null });
    } catch (error) {
      res.status(400).json({ data: null, message: 'Error al crear el pedido', error: String(error) });
    }
  };

  // ─── GET /api/pedidos/ventas-categoria ───────────────────────────────────────
  getSalesByCategory = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ventas = await this.obtenerVentasPorCategoria.execute();
      res.status(200).json({ data: ventas, message: 'Ventas por categoría obtenidas correctamente', error: null });
    } catch (error) {
      res.status(500).json({ data: null, message: 'Error al obtener ventas por categoría', error: String(error) });
    }
  };
}