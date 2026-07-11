import { IProductRepository } from '../domain/repositories/IProductRepository';
import { Product } from '../domain/entities/Product';

export class GetLowStockProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findLowStock();
  }
}
