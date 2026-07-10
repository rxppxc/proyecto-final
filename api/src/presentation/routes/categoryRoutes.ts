import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

export default function categoryRoutes(controller: CategoryController): Router {
  const router = Router();

  // GET /api/categorias — obtener todas las categorías
  router.get('/', controller.getAll);

  // GET /api/categorias/:id — obtener categoría por ID
  router.get('/:id', controller.getById);

  // POST /api/categorias — crear categoría
  router.post('/', controller.create);

  return router;
}
