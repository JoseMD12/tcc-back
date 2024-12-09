import { Injectable } from '@nestjs/common';
import { CreateOrderService } from './create-order.service';
import { PrismaService } from '../../database/database.service';
import { OrderModel } from '../../model/order/order.model';

@Injectable()
export class CreateManyOrderService {
  constructor(
    private readonly service: CreateOrderService,
    private readonly database: PrismaService,
  ) {}

  async createManyOrder(payload: OrderModel[]) {
    for (const order of payload) {
      await this.service.execute(order);
    }
  }
}
