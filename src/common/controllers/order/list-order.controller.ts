import { Controller, Get } from '@nestjs/common';
import { ListOrderService } from '../../providers/order/list-order.service';

@Controller('/order')
export class ListOrderController {
  constructor(private readonly listOrderService: ListOrderService) {}

  @Get()
  async getOrders() {
    return this.listOrderService.execute();
  }
}
