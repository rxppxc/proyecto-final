import type { Category } from '../entities/Category';

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  create(categoria: Category): Promise<Category>;
}
