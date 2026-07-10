import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

export default function productRoutes(controller: ProductController): Router {
  const router = Router();

  // GET /api/productos — obtener todos los productos disponibles
  router.get('/', controller.getAll);

  // GET /api/productos/low-stock — debe ir ANTES de /:id para no confundirse con un id
  router.get('/low-stock', controller.getLowStock);

  // GET /api/productos/:id — obtener producto por ID
  router.get('/:id', controller.getById);

  // POST /api/productos — crear producto
  router.post('/', controller.create);

  // PUT /api/productos/:id — actualizar producto
  router.put('/:id', controller.update);

  // DELETE /api/productos/:id — eliminar producto
  router.delete('/:id', controller.remove);

  return router;
}