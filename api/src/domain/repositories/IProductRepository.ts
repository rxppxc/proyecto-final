import type { Product } from '../entities/Product';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findAvailable(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findLowStock(): Promise<Product[]>;
  create(data: Product): Promise<Product>;
  update(id: number, data: Partial<Product>): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
}
