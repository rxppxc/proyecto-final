import { IProductRepository } from '../domain/repositories/IProductRepository';
import { Product } from '../domain/entities/Product';

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}
