import { IProductRepository } from '../domain/repositories/IProductRepository';
import { Product } from '../domain/entities/Product';

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: number, data: Partial<Product>): Promise<Product | null> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new Error(`Producto con id ${id} no encontrado`);
    return this.productRepository.update(id, data);
  }
}
