import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderService } from '../../providers/order/create-order.service';
import { OrderModel } from '../../model/order/order.model';

@Controller('/order')
export class CreateOrderController {
  constructor(private readonly createOrderService: CreateOrderService) {}

  @Post()
  async postOrder(@Body() payload: OrderModel) {
    return this.createOrderService.execute(payload);
  }
}
