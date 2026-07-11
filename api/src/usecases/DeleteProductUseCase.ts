import { IProductRepository } from '../domain/repositories/IProductRepository';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: number): Promise<boolean> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new Error(`Producto con id ${id} no encontrado`);
    return this.productRepository.delete(id);
  }
}
