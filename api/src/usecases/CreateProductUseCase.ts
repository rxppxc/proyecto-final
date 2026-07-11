import { IProductRepository } from '../domain/repositories/IProductRepository';
import { Product } from '../domain/entities/Product';

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(data: Product): Promise<Product> {
    if (!data.nombre || !data.precio || data.precio <= 0)
      throw new Error('Nombre y precio válido son requeridos');
    if (data.stock < 0)
      throw new Error('El stock no puede ser negativo');
    return this.productRepository.create(data);
  }
}
