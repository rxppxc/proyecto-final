import type { Request, Response } from 'express';
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

export class CategoryController {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  // ─── GET /api/categorias ─────────────────────────────────────────────────────
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await this.categoryRepository.findAll();
      res.status(200).json({ data: categorias, message: 'Categorías obtenidas correctamente', error: null });
    } catch (error) {
      res.status(500).json({ data: null, message: 'Error al obtener categorías', error: String(error) });
    }
  };

  // ─── GET /api/categorias/:id ─────────────────────────────────────────────────
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ data: null, message: 'ID inválido', error: 'El ID debe ser un número' });
        return;
      }
      const categoria = await this.categoryRepository.findById(id);
      if (!categoria) {
        res.status(404).json({ data: null, message: 'Categoría no encontrada', error: `No existe categoría con id ${id}` });
        return;
      }
      res.status(200).json({ data: categoria, message: 'Categoría obtenida correctamente', error: null });
    } catch (error) {
      res.status(500).json({ data: null, message: 'Error al obtener la categoría', error: String(error) });
    }
  };

  // ─── POST /api/categorias ────────────────────────────────────────────────────
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoria = await this.categoryRepository.create(req.body);
      res.status(201).json({ data: categoria, message: 'Categoría creada correctamente', error: null });
    } catch (error) {
      res.status(400).json({ data: null, message: 'Error al crear la categoría', error: String(error) });
    }
  };
}