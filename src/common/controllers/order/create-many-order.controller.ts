import { Body, Controller, Post } from '@nestjs/common';
import { CreateManyOrderService } from '../../providers/order/create-many-order.service';
import { OrderModel } from '../../model/order/order.model';

@Controller('/order')
export class CreateManyOrderController {
  constructor(private readonly service: CreateManyOrderService) {}

  @Post('/create-many')
  async createManyOrder(@Body() payload: OrderModel[]) {
    return this.service.createManyOrder(payload);
  }
}
