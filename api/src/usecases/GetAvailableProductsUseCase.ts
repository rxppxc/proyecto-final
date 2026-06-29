import { IProductRepository } from '../domain/repositories/IProductRepository';
import { Product } from '../domain/entities/Product';

export class GetAvailableProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAvailable();
  }
}
