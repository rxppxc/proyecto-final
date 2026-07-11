import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createDatabaseConnection } from './infra/database/mysqlConnection';
import { DatabaseCatalogRepository } from './infra/repositories/databaseCatalogRepository';
import { GetCatalogListUseCase } from './usecases/getCatalogListUseCase';
import { CatalogoController } from './presentation/controllers/catalogoController';
import catalogoRoutes from './presentation/routes/catalogoRoutes';
import { MySQLProductRepository } from './infra/repositories/MySQLProductRepository';
import { MySQLCategoryRepository } from './infra/repositories/MySQLCategoryRepository';
import { MySQLOrderRepository } from './infra/repositories/MySQLOrderRepository';
import { ProductController } from './presentation/controllers/ProductController';
import { CategoryController } from './presentation/controllers/CategoryController';
import { OrderController } from './presentation/controllers/OrderController';
import productRoutes from './presentation/routes/productRoutes';
import categoryRoutes from './presentation/routes/categoryRoutes';
import orderRoutes from './presentation/routes/orderRoutes';

const app = express();

app.use(cors({ origin: 'http://localhost:8000' }));
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Catalog API',
    version: process.env.npm_package_version ?? '1.0.0',
  });
});

async function bootstrap(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000);
  const connection = await createDatabaseConnection();

  const repository = new DatabaseCatalogRepository(connection);
  const useCase = new GetCatalogListUseCase(repository);
  const controller = new CatalogoController(useCase);
  app.use('/api/catalogo', catalogoRoutes(controller));

  const productRepository = new MySQLProductRepository(connection);
  const categoryRepository = new MySQLCategoryRepository(connection);
  const orderRepository = new MySQLOrderRepository(connection);

  const productController = new ProductController(productRepository);
  const categoryController = new CategoryController(categoryRepository);
  const orderController = new OrderController(orderRepository);

  app.use('/api/productos', productRoutes(productController));
  app.use('/api/categorias', categoryRoutes(categoryController));
  app.use('/api/pedidos', orderRoutes(orderController));

  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start API server', error);
  process.exit(1);
});

// Middleware global de errores
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ data: null, message: 'Error interno del servidor', error: err.message });
});