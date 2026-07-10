import type { CatalogRepository } from '../domain/repositories/catalogRepository';
import type { CatalogItem } from '../domain/entities/catalogItem';

export class GetCatalogListUseCase {
  constructor(private readonly repository: CatalogRepository) {}

  async execute(): Promise<CatalogItem[]> {
    return this.repository.getAll();
  }
}
