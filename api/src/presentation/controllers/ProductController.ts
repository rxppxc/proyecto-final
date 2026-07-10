import type { Request, Response } from 'express';
import type { IProductRepository } from '../../domain/repositories/IProductRepository';
import { GetAvailableProductsUseCase } from '../../usecases/GetAvailableProductsUseCase';
import { GetProductByIdUseCase } from '../../usecases/GetProductByIdUseCase';
import { GetLowStockProductsUseCase } from '../../usecases/GetLowStockProductsUseCase';
import { CreateProductUseCase } from '../../usecases/CreateProductUseCase';
import { UpdateProductUseCase } from '../../usecases/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../usecases/DeleteProductUseCase';

export class ProductController {
  // Casos de uso instanciados a partir del repositorio inyectado
  private readonly obtenerProductosDisponibles: GetAvailableProductsUseCase;
  private readonly obtenerProductoPorId: GetProductByIdUseCase;
  private readonly obtenerProductosBajoStock: GetLowStockProductsUseCase;
  private readonly crearProducto: CreateProductUseCase;
  private readonly actualizarProducto: UpdateProductUseCase;
  private readonly eliminarProducto: DeleteProductUseCase;

  constructor(private readonly productRepository: IProductRepository) {
    this.obtenerProductosDisponibles = new GetAvailableProductsUseCase(productRepository);
    this.obtenerProductoPorId = new GetProductByIdUseCase(productRepository);
    this.obtenerProductosBajoStock = new GetLowStockProductsUseCase(productRepository);
    this.crearProducto = new CreateProductUseCase(productRepository);
    this.actualizarProducto = new UpdateProductUseCase(productRepository);
    this.eliminarProducto = new DeleteProductUseCase(productRepository);
  }

  // ─── GET /api/productos ──────────────────────────────────────────────────────
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const productos = await this.obtenerProductosDisponibles.execute();
      res.status(200).json({ data: productos, message: 'Productos obtenidos correctamente', error: null });
    } catch (error) {
      res.status(500).json({ data: null, message: 'Error al obtener productos', error: String(error) });
    }
  };

  // ─── GET /api/productos/:id ──────────────────────────────────────────────────
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ data: null, message: 'ID inválido', error: 'El ID debe ser un número' });
        return;
      }
      const producto = await this.obtenerProductoPorId.execute(id);
      if (!producto) {
        res.status(404).json({ data: null, message: 'Producto no encontrado', error: `No existe producto con id ${id}` });
        return;
      }
      res.status(200).json({ data: producto, message: 'Producto obtenido correctamente', error: null });
    } catch (error) {
      res.status(500).json({ data: null, message: 'Error al obtener el producto', error: String(error) });
    }
  };

  // ─── GET /api/productos/low-stock ────────────────────────────────────────────
  getLowStock = async (_req: Request, res: Response): Promise<void> => {
    try {
      const productos = await this.obtenerProductosBajoStock.execute();
      res.status(200).json({ data: productos, message: 'Productos con bajo stock obtenidos correctamente', error: null });
    } catch (error) {
      res.status(500).json({ data: null, message: 'Error al obtener productos con bajo stock', error: String(error) });
    }
  };

  // ─── POST /api/productos ─────────────────────────────────────────────────────
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const producto = await this.crearProducto.execute(req.body);
      res.status(201).json({ data: producto, message: 'Producto creado correctamente', error: null });
    } catch (error) {
      res.status(400).json({ data: null, message: 'Error al crear el producto', error: String(error) });
    }
  };

  // ─── PUT /api/productos/:id ──────────────────────────────────────────────────
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ data: null, message: 'ID inválido', error: 'El ID debe ser un número' });
        return;
      }
      const producto = await this.actualizarProducto.execute(id, req.body);
      if (!producto) {
        res.status(404).json({ data: null, message: 'Producto no encontrado', error: `No existe producto con id ${id}` });
        return;
      }
      res.status(200).json({ data: producto, message: 'Producto actualizado correctamente', error: null });
    } catch (error) {
      res.status(500).json({ data: null, message: 'Error al actualizar el producto', error: String(error) });
    }
  };

  // ─── DELETE /api/productos/:id ───────────────────────────────────────────────
  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ data: null, message: 'ID inválido', error: 'El ID debe ser un número' });
        return;
      }
      const eliminado = await this.eliminarProducto.execute(id);
      if (!eliminado) {
        res.status(404).json({ data: null, message: 'Producto no encontrado', error: `No existe producto con id ${id}` });
        return;
      }
      res.status(200).json({ data: null, message: 'Producto eliminado correctamente', error: null });
    } catch (error) {
      res.status(500).json({ data: null, message: 'Error al eliminar el producto', error: String(error) });
    }
  };
}