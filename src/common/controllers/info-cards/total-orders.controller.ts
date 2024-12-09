import { Controller, Get } from '@nestjs/common';
import { TotalOrdersService } from '../../providers/info-cards/total-orders.service';

@Controller('/total-orders')
export class TotalOrdersController {
  constructor(private readonly service: TotalOrdersService) {}

  @Get()
  async getTotalOrders() {
    return this.service.getTotalOrders();
  }
}
