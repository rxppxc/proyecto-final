import { IOrderRepository } from '../domain/repositories/IOrderRepository';

export class GetSalesByCategoryUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(): Promise<{ categoria: string; total_ventas: number }[]> {
    return this.orderRepository.getSalesByCategory();
  }
}
