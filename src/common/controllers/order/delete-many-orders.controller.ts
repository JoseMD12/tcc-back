import { Controller, Delete } from '@nestjs/common';
import { DeleteManyOrdersService } from '../../providers/order/delete-many-orders.service';

@Controller('/order')
export class DeleteManyOrdersController {
  constructor(
    private readonly deleteManyOrdersService: DeleteManyOrdersService,
  ) {}

  @Delete()
  async deleteManyOrders(payload: string[]) {
    return this.deleteManyOrdersService.execute(payload);
  }
}
