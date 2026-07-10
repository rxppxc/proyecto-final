import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

export default function orderRoutes(controller: OrderController): Router {
  const router = Router();

  // GET /api/pedidos — obtener todos los pedidos
  router.get('/', controller.getAll);

  // GET /api/pedidos/ventas-categoria — debe ir ANTES de /:id para no confundirse con un id
  router.get('/ventas-categoria', controller.getSalesByCategory);

  // GET /api/pedidos/:id — obtener pedido por ID
  router.get('/:id', controller.getById);

  // POST /api/pedidos — crear pedido
  router.post('/', controller.create);

  return router;
}